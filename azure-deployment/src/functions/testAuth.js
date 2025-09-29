const { app } = require('@azure/functions');

app.http('testAuth', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'auth/test',
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

            // Mock user creation for testing
            const mockUser = {
                id: 'test-user-' + Date.now(),
                email: email,
                full_name: full_name || 'Test User',
                created_at: new Date().toISOString()
            };

            return {
                status: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    user: mockUser
                })
            };

        } catch (error) {
            context.log.error('Test auth error:', error);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Test auth failed',
                    details: error.message 
                })
            };
        }
    }
});
