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

app.http('getCivicActions', {
    methods: ['GET', 'OPTIONS'],
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
        
        context.log('Getting civic actions from database');
        
        try {
            // Connect to database
            await sql.connect(config);
            context.log('Connected to Azure SQL Database');
            
            // Get all civic actions
            const result = await sql.query`
                SELECT 
                    id, title, description, category, location, date_time,
                    organizer, contact_info, requirements, accessibility_notes,
                    virtual_link, tags, status, priority
                FROM civic_actions 
                ORDER BY date_time DESC
            `;
            
            const civicActions = result.recordset.map(row => ({
                id: row.id,
                title: row.title,
                description: row.description,
                category: row.category,
                location: row.location,
                date_time: row.date_time,
                organizer: row.organizer,
                contact_info: row.contact_info,
                requirements: row.requirements,
                accessibility_notes: row.accessibility_notes,
                virtual_link: row.virtual_link,
                tags: row.tags,
                status: row.status,
                priority: row.priority
            }));
            
            context.log(`Found ${civicActions.length} civic actions`);
            
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With',
                    'Access-Control-Max-Age': '86400'
                },
                jsonBody: {
                    success: true,
                    civicActions: civicActions,
                    count: civicActions.length,
                    timestamp: new Date().toISOString()
                }
            };
            
        } catch (error) {
            context.log(`Error getting civic actions: ${error.message}`);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Origin, X-Requested-With',
                    'Access-Control-Max-Age': '86400'
                },
                jsonBody: {
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            };
        } finally {
            await sql.close();
        }
    }
});
