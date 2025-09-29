const { app } = require('@azure/functions');
const sql = require('mssql');
const axios = require('axios');
const cheerio = require('cheerio');

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

app.timer('maLegislatureSyncTimer', {
    schedule: '0 */30 * * * *', // Every 30 minutes
    handler: async (myTimer, context) => {
        context.log('MA Legislature sync timer triggered');
        
        try {
            // Connect to database
            await sql.connect(config);
            context.log('Connected to Azure SQL Database');
            
            // Fetch MA Legislature events
            const eventsUrl = 'https://malegislature.gov/Events';
            context.log(`Fetching ${eventsUrl}...`);
            
            const response = await axios.get(eventsUrl, {
                headers: {
                    'User-Agent': 'Community-Clarity-AI/1.0 (Civic Engagement Platform)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            });
            
            context.log(`Fetched ${response.data.length} characters from MA Legislature`);
            
            // Extract hearing IDs
            const hearingIds = extractHearingIdsFromHtml(response.data);
            context.log(`Found ${hearingIds.length} hearing IDs`);
            
            let syncedCount = 0;
            let errorCount = 0;
            
            // Process all hearings
            for (const id of hearingIds) {
                try {
                    const apiUrl = `https://malegislature.gov/api/Hearings/${id}`;
                    context.log(`Fetching hearing ${id}...`);
                    
                    const hearingResponse = await axios.get(apiUrl);
                    const hearing = parseHearingXML(hearingResponse.data, id);
                    
                    if (hearing && hearing.title) {
                        // Check if hearing already exists
                        const existingResult = await sql.query`
                            SELECT id FROM civic_actions WHERE title = ${hearing.title} AND organizer = ${hearing.organizer}
                        `;
                        
                        if (existingResult.recordset.length === 0) {
                            // Insert new hearing
                            await sql.query`
                                INSERT INTO civic_actions (
                                    title, description, category, location, date_time, 
                                    organizer, contact_info, requirements, accessibility_notes,
                                    virtual_link, tags, status, priority
                                ) VALUES (
                                    ${hearing.title},
                                    ${hearing.description},
                                    'Legislative Hearing',
                                    ${hearing.location},
                                    ${hearing.starts_at},
                                    ${hearing.organizer},
                                    ${JSON.stringify(hearing.contact_info)},
                                    ${JSON.stringify(hearing.requirements)},
                                    ${hearing.accessibility_notes},
                                    ${hearing.virtual_link},
                                    ${JSON.stringify(hearing.tags || ['government', 'legislature', 'public-hearing'])},
                                    'active',
                                    'normal'
                                )
                            `;
                            
                            syncedCount++;
                            context.log(`✅ Synced hearing: ${hearing.title}`);
                        } else {
                            context.log(`⏭️ Hearing already exists: ${hearing.title}`);
                        }
                    }
                } catch (error) {
                    errorCount++;
                    context.log(`❌ Error processing hearing ${id}: ${error.message}`);
                }
            }
            
            // Update API integration cache
            await sql.query`
                MERGE api_integrations AS target
                USING (SELECT 'ma_legislature_hearings' AS api_name) AS source
                ON target.api_name = source.api_name
                WHEN MATCHED THEN
                    UPDATE SET 
                        data = ${JSON.stringify({ 
                            hearings: syncedCount, 
                            last_sync: new Date().toISOString(),
                            source: 'azure_function_timer'
                        })},
                        last_updated = ${new Date().toISOString()},
                        expires_at = ${new Date(Date.now() + 60 * 60 * 1000).toISOString()},
                        status = 'active'
                WHEN NOT MATCHED THEN
                    INSERT (api_name, endpoint, data, last_updated, expires_at, status)
                    VALUES (
                        'ma_legislature_hearings',
                        'https://malegislature.gov/api/',
                        ${JSON.stringify({ 
                            hearings: syncedCount, 
                            last_sync: new Date().toISOString(),
                            source: 'azure_function_timer'
                        })},
                        ${new Date().toISOString()},
                        ${new Date(Date.now() + 60 * 60 * 1000).toISOString()},
                        'active'
                    );
            `;
            
            context.log(`Timer sync completed: ${syncedCount} hearings synced, ${errorCount} errors`);
            
        } catch (error) {
            context.log(`Error in MA Legislature timer sync: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
});

function extractHearingIdsFromHtml(html) {
    const ids = [];
    
    const patterns = [
        /href="\/Events\/Hearings\/Detail\/(\d+)"/g,
        /\/Events\/Hearings\/Detail\/(\d+)/g,
        /\/Hearings\/(\d+)/g,
        /hearing[_-]?id[=:](\d+)/gi,
        /id[=:](\d+).*hearing/gi
    ];
    
    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            ids.push(match[1]);
        }
    }
    
    return [...new Set(ids)];
}

function parseHearingXML(xml, id) {
    try {
        const $ = cheerio.load(xml, { xmlMode: true });
        
        const title = $('Title').text().trim() || `Legislative Hearing ${id}`;
        const description = $('Description').text().trim() || 'Massachusetts Legislature hearing';
        const eventDate = $('EventDate').text().trim();
        const location = $('Location').text().trim() || 'Massachusetts State House';
        const committee = $('Committee').text().trim() || 'Massachusetts Legislature';
        
        let starts_at = null;
        if (eventDate) {
            try {
                const date = new Date(eventDate);
                if (!isNaN(date.getTime())) {
                    starts_at = date.toISOString();
                }
            } catch (error) {
                console.warn(`Invalid date format: ${eventDate}`);
            }
        }
        
        let virtual_link = null;
        if (description) {
            const zoomMatch = description.match(/(https?:\/\/[^\s]+zoom[^\s]*)/i);
            const teamsMatch = description.match(/(https?:\/\/[^\s]+teams[^\s]*)/i);
            const meetMatch = description.match(/(https?:\/\/[^\s]+meet[^\s]*)/i);
            
            virtual_link = zoomMatch?.[1] || teamsMatch?.[1] || meetMatch?.[1] || null;
        }
        
        let accessibility_notes = null;
        if (description) {
            const aslMatch = description.match(/(ASL|sign language|interpretation)/i);
            const accessMatch = description.match(/(accessible|wheelchair|disability)/i);
            
            if (aslMatch || accessMatch) {
                accessibility_notes = 'Accessibility accommodations available. See event details for specific information.';
            }
        }
        
        return {
            id,
            title,
            description,
            starts_at,
            location,
            organizer: committee,
            contact_info: {
                source: 'ma_legislature',
                hearing_id: id,
                website: 'https://malegislature.gov'
            },
            requirements: ['Public hearing - open to all'],
            accessibility_notes,
            virtual_link,
            tags: ['government', 'legislature', 'public-hearing']
        };
        
    } catch (error) {
        console.error(`Error parsing XML for hearing ${id}:`, error);
        return null;
    }
}
