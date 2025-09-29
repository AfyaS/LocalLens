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

app.http('getMALegislatureHearings', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Getting MA Legislature hearings from database');
        
        try {
            // Connect to database
            await sql.connect(config);
            context.log('Connected to Azure SQL Database');
            
            // Get MA Legislature hearings specifically
            const result = await sql.query`
                SELECT 
                    id, title, description, category, location, date_time,
                    organizer, contact_info, requirements, accessibility_notes,
                    virtual_link, tags, status, priority
                FROM civic_actions 
                WHERE organizer LIKE '%Legislature%' OR organizer LIKE '%Massachusetts%'
                ORDER BY date_time DESC
            `;
            
            const hearings = result.recordset.map(row => ({
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
            
            context.log(`Found ${hearings.length} MA Legislature hearings`);
            
            return {
                status: 200,
                jsonBody: {
                    success: true,
                    hearings: hearings,
                    count: hearings.length,
                    timestamp: new Date().toISOString()
                }
            };
            
        } catch (error) {
            context.log(`Error getting MA Legislature hearings: ${error.message}`);
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
