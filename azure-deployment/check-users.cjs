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

async function checkUsers() {
  try {
    console.log('🔗 Connecting to Azure SQL Database...');
    await sql.connect(config);
    console.log('✅ Connected successfully!');

    // Check users table
    console.log('👥 Checking users table...');
    const usersResult = await sql.query`SELECT id, email, full_name FROM users`;
    console.log('📊 Users found:', usersResult.recordset.length);
    
    if (usersResult.recordset.length > 0) {
      console.log('👤 Sample users:');
      usersResult.recordset.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} (${user.full_name}) - ID: ${user.id}`);
      });
    } else {
      console.log('❌ No users found in database');
    }

    // Check if user_impact_tracking table exists
    console.log('📋 Checking user_impact_tracking table...');
    const tableResult = await sql.query`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'user_impact_tracking'
    `;
    
    if (tableResult.recordset.length > 0) {
      console.log('✅ user_impact_tracking table exists');
      
      // Check if there are any records
      const recordsResult = await sql.query`SELECT COUNT(*) as count FROM user_impact_tracking`;
      console.log(`📊 Records in user_impact_tracking: ${recordsResult.recordset[0].count}`);
    } else {
      console.log('❌ user_impact_tracking table does not exist');
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
    throw error;
  } finally {
    await sql.close();
    console.log('🔐 Database connection closed');
  }
}

// Run the check
checkUsers()
  .then(() => {
    console.log('✅ Database check completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database check failed:', error);
    process.exit(1);
  });
