const { app } = require('@azure/functions');

app.http('testAuthSimple', {
    methods: ['GET', 'POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'auth/test-simple',
    handler: async (request, context) => {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400'
                },
                body: ''
            };
        }

        try {
            context.log('Test auth function called');
            
            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                jsonBody: {
                    success: true,
                    message: 'Test auth function is working',
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            context.log(`Error in test auth: ${error.message}`);
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
        }
    }
});
