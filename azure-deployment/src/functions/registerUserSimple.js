const { app } = require('@azure/functions');
const sql = require('mssql');
const bcrypt = require('bcryptjs');

app.http('registerUserSimple', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'auth/register-simple',
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
            context.log('Registration function called');
            
            const { email, password, full_name } = await request.json();
            context.log(`Received: email=${email}, password=${password ? 'provided' : 'missing'}, full_name=${full_name}`);
            
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

            // Check if user already exists
            context.log('Checking if user exists...');
            const existingUser = await sql.query`
                SELECT id FROM users WHERE email = ${email}
            `;

            if (existingUser.recordset.length > 0) {
                context.log('User already exists');
                return {
                    status: 409,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    jsonBody: {
                        success: false,
                        error: 'User already exists'
                    }
                };
            }

            context.log('Hashing password...');
            // Hash password
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            context.log('Password hashed successfully');

            context.log('Creating user...');
            // Create new user
            const result = await sql.query`
                INSERT INTO users (email, password_hash, full_name, created_at, updated_at)
                OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.created_at
                VALUES (${email}, ${passwordHash}, ${full_name || null}, GETDATE(), GETDATE())
            `;

            const user = result.recordset[0];
            context.log(`User created with ID: ${user.id}`);

            // Create user profile
            context.log('Creating user profile...');
            await sql.query`
                INSERT INTO user_profiles (user_id, created_at, updated_at)
                VALUES (${user.id}, GETDATE(), GETDATE())
            `;

            // Create user reputation record
            context.log('Creating user reputation...');
            await sql.query`
                INSERT INTO user_reputation (user_id, reputation_score, created_at, updated_at)
                VALUES (${user.id}, 0, GETDATE(), GETDATE())
            `;

            context.log('Registration completed successfully');

            return {
                status: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                jsonBody: {
                    success: true,
                    message: 'User registered successfully',
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        created_at: user.created_at
                    }
                }
            };

        } catch (error) {
            context.log(`Error in registration: ${error.message}`);
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
