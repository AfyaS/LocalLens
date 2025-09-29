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

app.http('getApiIntegrations', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Getting API integrations from database');
        
        try {
            // Connect to database
            await sql.connect(config);
            context.log('Connected to Azure SQL Database');
            
            // Get API integrations
            const result = await sql.query`
                SELECT 
                    api_name, endpoint, data, last_updated, expires_at, status
                FROM api_integrations 
                ORDER BY last_updated DESC
            `;
            
            const integrations = result.recordset.map(row => ({
                api_name: row.api_name,
                endpoint: row.endpoint,
                data: row.data,
                last_updated: row.last_updated,
                expires_at: row.expires_at,
                status: row.status
            }));
            
            context.log(`Found ${integrations.length} API integrations`);
            
            return {
                status: 200,
                jsonBody: {
                    success: true,
                    integrations: integrations,
                    count: integrations.length,
                    timestamp: new Date().toISOString()
                }
            };
            
        } catch (error) {
            context.log(`Error getting API integrations: ${error.message}`);
            return {
                status: 500,
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
