const { app } = require('@azure/functions');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

app.http('loginUser', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'auth/login',
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
            const { email, password } = await request.json();
            
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

            // Get user by email
            const result = await sql.query`
                SELECT id, email, full_name, password_hash, created_at
                FROM users 
                WHERE email = ${email}
            `;

            if (result.recordset.length === 0) {
                return {
                    status: 401,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Invalid credentials' })
                };
            }

            const user = result.recordset[0];

            // For now, we'll skip password verification since we don't have password hashing set up
            // In production, you would verify the password hash here
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            
            if (!isValidPassword) {
                return {
                    status: 401,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    jsonBody: {
                        success: false,
                        error: 'Invalid credentials'
                    }
                };
            }

            // Update last login
            await sql.query`
                UPDATE users 
                SET last_login = GETDATE(), updated_at = GETDATE()
                WHERE id = ${user.id}
            `;

            return {
                status: 200,
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
            context.log.error('Login error:', error);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Login failed',
                    details: error.message 
                })
            };
        } finally {
            await sql.close();
        }
    }
});
