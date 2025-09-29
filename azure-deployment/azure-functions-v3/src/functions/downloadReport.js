const { app } = require('@azure/functions');
const sql = require('mssql');

app.http('downloadReport', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'impact/download-report',
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
            const { userId } = await request.json();
            
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

            // Connect to Azure SQL Database
            const config = {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                server: process.env.DB_SERVER,
                database: process.env.DB_NAME,
                options: {
                    encrypt: true,
                    trustServerCertificate: false
                }
            };

            await sql.connect(config);

            // Get user stats
            const userResult = await sql.query`
                SELECT u.email, u.full_name, u.created_at,
                       up.actions_created, up.total_engagement, up.impact_score
                FROM users u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = ${userId}
            `;

            if (userResult.recordset.length === 0) {
                return {
                    status: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'User not found' })
                };
            }

            const user = userResult.recordset[0];

            // Get user's civic actions
            const actionsResult = await sql.query`
                SELECT title, description, category, status, created_at
                FROM civic_actions
                WHERE created_by = ${userId}
                ORDER BY created_at DESC
            `;

            // Generate report data
            const reportData = {
                user: {
                    name: user.full_name || 'Anonymous',
                    email: user.email,
                    memberSince: user.created_at
                },
                stats: {
                    actionsCreated: user.actions_created || 0,
                    totalEngagement: user.total_engagement || 0,
                    impactScore: user.impact_score || 0
                },
                actions: actionsResult.recordset,
                generatedAt: new Date().toISOString()
            };

            // Generate CSV content
            const csvContent = generateCSVReport(reportData);

            return {
                status: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="civic-impact-report.csv"'
                },
                body: csvContent
            };

        } catch (error) {
            context.log.error('Download report error:', error);
            return {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'Report generation failed',
                    details: error.message 
                })
            };
        } finally {
            await sql.close();
        }
    }
});

function generateCSVReport(data) {
    const headers = [
        'Report Type',
        'User Name',
        'Email',
        'Member Since',
        'Actions Created',
        'Total Engagement',
        'Impact Score',
        'Generated At'
    ];

    const userRow = [
        'Civic Impact Report',
        data.user.name,
        data.user.email,
        data.user.memberSince,
        data.stats.actionsCreated,
        data.stats.totalEngagement,
        data.stats.impactScore,
        data.generatedAt
    ];

    const actionHeaders = [
        'Action Title',
        'Description',
        'Category',
        'Status',
        'Created At'
    ];

    const csvLines = [
        headers.join(','),
        userRow.join(','),
        '',
        'Civic Actions:',
        actionHeaders.join(',')
    ];

    data.actions.forEach(action => {
        const row = [
            `"${action.title || ''}"`,
            `"${action.description || ''}"`,
            action.category || '',
            action.status || '',
            action.created_at || ''
        ];
        csvLines.push(row.join(','));
    });

    return csvLines.join('\n');
}
