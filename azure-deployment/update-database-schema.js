const sql = require('mssql');
const fs = require('fs');

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

async function updateDatabaseSchema() {
  try {
    console.log('🔗 Connecting to Azure SQL Database...');
    await sql.connect(config);
    console.log('✅ Connected successfully!');

    // Read the SQL schema file
    const schemaSQL = fs.readFileSync('./azure-sql-schema-impact-tracking.sql', 'utf8');
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        try {
          await sql.query(statement);
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
        } catch (error) {
          console.log(`   ⚠️  Statement ${i + 1} warning: ${error.message}`);
          // Continue with other statements even if one fails
        }
      }
    }

    console.log('🎉 Database schema update completed!');
    
    // Verify the tables were created
    console.log('🔍 Verifying tables...');
    const tablesResult = await sql.query`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME IN ('user_impact_tracking', 'user_reputation')
    `;
    
    console.log('📊 Created tables:', tablesResult.recordset.map(r => r.TABLE_NAME));

  } catch (error) {
    console.error('❌ Error updating database schema:', error);
    throw error;
  } finally {
    await sql.close();
    console.log('🔐 Database connection closed');
  }
}

// Run the update
updateDatabaseSchema()
  .then(() => {
    console.log('✅ Database schema update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database schema update failed:', error);
    process.exit(1);
  });
