const { app } = require('@azure/functions');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

app.http('loginUserSimple', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'auth/login-simple',
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
            context.log('Login function called');
            
            const { email, password } = await request.json();
            context.log(`Received: email=${email}, password=${password ? 'provided' : 'missing'}`);
            
            if (!email || !password) {
                return {
                    status: 400,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    jsonBody: {
                        success: false,
                        error: 'Email and password are required'
                    }
                };
            }

            context.log('Connecting to database...');
            
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
            context.log('Connected to database');

            // Get user by email
            context.log('Looking up user...');
            const result = await sql.query`
                SELECT id, email, password_hash, full_name, created_at, last_login, is_active
                FROM users 
                WHERE email = ${email}
            `;

            if (result.recordset.length === 0) {
                context.log('User not found');
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

            const user = result.recordset[0];
            context.log(`User found: ${user.email}`);

            // Check if user is active
            if (!user.is_active) {
                context.log('User account is inactive');
                return {
                    status: 401,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    jsonBody: {
                        success: false,
                        error: 'Account is inactive'
                    }
                };
            }

            // Verify password
            context.log('Verifying password...');
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            
            if (!isValidPassword) {
                context.log('Invalid password');
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

            context.log('Password verified successfully');

            // Update last login
            context.log('Updating last login...');
            await sql.query`
                UPDATE users 
                SET last_login = GETDATE(), updated_at = GETDATE()
                WHERE id = ${user.id}
            `;

            context.log('Login completed successfully');

            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                jsonBody: {
                    success: true,
                    message: 'Login successful',
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        last_login: new Date().toISOString()
                    }
                }
            };

        } catch (error) {
            context.log(`Error in login: ${error.message}`);
            context.log(`Error stack: ${error.stack}`);
            
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                jsonBody: {
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                }
            };
        } finally {
            try {
                await sql.close();
                context.log('Database connection closed');
            } catch (closeError) {
                context.log(`Error closing database: ${closeError.message}`);
            }
        }
    }
});
