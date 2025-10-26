const { app } = require('@azure/functions');
const sql = require('mssql');

const config = {
  server: 'civic-sql-server-1759040339.database.windows.net',
  database: 'community-clarity-db',
  user: 'civicadmin',
  password: 'CivicEngagement2024!@#',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

app.http('trackImpact', {
    methods: ['POST', 'GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With',
                    'Access-Control-Max-Age': '86400'
                },
                body: ''
            };
        }
        
        context.log('Impact tracking request received');
        
        try {
            // Connect to database
            context.log('Connecting to database...');
            await sql.connect(config);
            context.log('Database connected successfully');
            
            if (request.method === 'POST') {
                // Add new impact tracking entry
                const body = await request.json();
                const { 
                    userId, 
                    title, 
                    description, 
                    category, 
                    date, 
                    impact_type, 
                    people_reached, 
                    hours_spent, 
                    location, 
                    notes 
                } = body;
                
                // Validate required fields
                if (!userId || !title || !description || !category) {
                    return {
                        status: 400,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ error: 'Missing required fields' })
                    };
                }
                
                // Insert new impact tracking entry
                context.log('Inserting impact tracking entry for user:', userId);
                const result = await sql.query`
                    INSERT INTO user_impact_tracking (
                        user_id, title, description, category, date, 
                        impact_type, people_reached, hours_spent, location, notes, created_at
                    ) VALUES (
                        ${userId}, ${title}, ${description}, ${category}, ${date},
                        ${impact_type || 'Direct Service'}, ${people_reached || 0}, ${hours_spent || 0}, 
                        ${location || ''}, ${notes || ''}, GETUTCDATE()
                    )
                `;
                context.log('Impact tracking entry inserted successfully');
                
                // Try to update user reputation/impact score (ignore if table doesn't exist)
                try {
                    await sql.query`
                        UPDATE user_reputation 
                        SET impact_points = impact_points + ${Math.max(1, people_reached || 0)},
                            reputation_score = reputation_score + ${Math.max(1, hours_spent || 1)},
                            updated_at = GETUTCDATE()
                        WHERE user_id = ${userId}
                    `;
                } catch (reputationError) {
                    context.log.warn('Could not update user reputation:', reputationError.message);
                    // Continue without failing the main operation
                }
                
                return {
                    status: 201,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        success: true, 
                        message: 'Impact tracked successfully',
                        impactId: result.recordset[0]?.id 
                    })
                };
                
            } else if (request.method === 'GET') {
                // Get user's impact tracking entries
                const url = new URL(request.url);
                const userId = url.searchParams.get('userId');
                
                if (!userId) {
                    return {
                        status: 400,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ error: 'User ID is required' })
                    };
                }
                
                const result = await sql.query`
                    SELECT 
                        id, title, description, category, date, impact_type,
                        people_reached, hours_spent, location, notes, created_at
                    FROM user_impact_tracking 
                    WHERE user_id = ${userId}
                    ORDER BY date DESC, created_at DESC
                `;
                
                return {
                    status: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        success: true,
                        activities: result.recordset 
                    })
                };
            }
            
        } catch (error) {
            context.log.error('Impact tracking error:', error);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Internal server error',
                    details: error.message 
                })
            };
        } finally {
            await sql.close();
        }
    }
});
