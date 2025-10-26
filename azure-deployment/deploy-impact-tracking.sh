#!/bin/bash

# Deploy Impact Tracking Function to Azure
# This script deploys the new trackImpact function and updates the database schema

echo "🚀 Deploying Impact Tracking Function to Azure..."

# Set variables
RESOURCE_GROUP="community-clarity-rg"
FUNCTION_APP_NAME="community-clarity-func-v2"
FUNCTION_NAME="trackImpact"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo "❌ Please log in to Azure first: az login"
    exit 1
fi

echo "✅ Azure CLI is ready"

# Deploy the function
echo "📦 Deploying trackImpact function..."
cd azure-functions-v3

# Copy the new function
cp src/functions/trackImpact.js .

# Deploy to Azure Functions
echo "🚀 Deploying to Azure Functions..."
func azure functionapp publish $FUNCTION_APP_NAME --node

if [ $? -eq 0 ]; then
    echo "✅ Function deployed successfully!"
else
    echo "❌ Function deployment failed"
    exit 1
fi

# Update database schema
echo "🗄️ Updating database schema..."

# Connect to Azure SQL and run the schema update
echo "Running database schema update..."
az sql db execute \
    --resource-group $RESOURCE_GROUP \
    --server civic-sql-server-1759040339 \
    --database community-clarity-db \
    --file-path azure-sql-schema-impact-tracking.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema updated successfully!"
else
    echo "❌ Database schema update failed"
    exit 1
fi

echo "🎉 Impact tracking deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Test the new impact tracking functionality"
echo "2. Verify the database tables were created"
echo "3. Check the Azure Function logs for any issues"
echo ""
echo "🔗 Function URL: https://$FUNCTION_APP_NAME.azurewebsites.net/api/trackImpact"
echo "📊 Database: civic-sql-server-1759040339.database.windows.net"
