const { app } = require('@azure/functions');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

app.http('registerUser', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'auth/register',
    handler: async (request, context) => {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400'
                },
                body: ''
            };
        }

        try {
            const { email, password, full_name } = await request.json();
            
            if (!email || !password) {
                return {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Email and password are required' })
                };
            }

            // Connect to Azure SQL Database
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

            await sql.connect(config);

            // Check if user already exists
            const existingUser = await sql.query`
                SELECT id FROM users WHERE email = ${email}
            `;

            if (existingUser.recordset.length > 0) {
                return {
                    status: 409,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'User already exists' })
                };
            }

            // Hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            // Create new user
            const result = await sql.query`
                INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
                OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.created_at
                VALUES (${email}, ${passwordHash}, ${full_name || null}, GETDATE(), GETDATE())
            `;

            const user = result.recordset[0];

            // Create user profile
            await sql.query`
                INSERT INTO user_profiles (user_id, created_at, updated_at)
                VALUES (${user.id}, GETDATE(), GETDATE())
            `;

            // Create user reputation
            await sql.query`
                INSERT INTO user_reputation (user_id, reputation_score, created_at, updated_at)
                VALUES (${user.id}, 0, GETDATE(), GETDATE())
            `;

            return {
                status: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        created_at: user.created_at
                    }
                })
            };

        } catch (error) {
            context.log.error('Registration error:', error);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Registration failed',
                    details: error.message 
                })
            };
        } finally {
            await sql.close();
        }
    }
});
