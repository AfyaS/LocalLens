#!/bin/bash

# Production Deployment Script for Community Clarity AI on Azure
# Complete migration from Supabase to Azure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="community-clarity-prod-rg"
LOCATION="eastus"
ENVIRONMENT="prod"
APP_NAME="community-clarity"
ADMIN_LOGIN="civicadmin"

echo -e "${BLUE}🚀 Production Deployment - Community Clarity AI${NC}"
echo "=================================================="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed. Please install it first:${NC}"
    echo "curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash"
    exit 1
fi

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}🔐 Please login to Azure:${NC}"
    az login
fi

echo -e "${GREEN}✅ Azure CLI is installed and you are logged in${NC}"
echo ""

# Get current subscription
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
SUBSCRIPTION_NAME=$(az account show --query name -o tsv)
echo -e "${BLUE}📋 Current Subscription:${NC} $SUBSCRIPTION_NAME ($SUBSCRIPTION_ID)"
echo ""

# Prompt for database password
echo -e "${YELLOW}🔐 Enter a secure password for the database administrator:${NC}"
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${RED}❌ Database password cannot be empty${NC}"
    exit 1
fi

# Create production resource group
echo -e "${BLUE}📦 Creating production resource group: $RESOURCE_GROUP${NC}"
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --tags Environment=$ENVIRONMENT Project="Community Clarity AI" Tier="Production"

echo -e "${GREEN}✅ Production resource group created${NC}"
echo ""

# Deploy production infrastructure
echo -e "${BLUE}🏗️  Deploying production Azure infrastructure...${NC}"
echo "This may take 15-20 minutes..."

az deployment group create \
    --resource-group $RESOURCE_GROUP \
    --template-file azure-infrastructure.bicep \
    --parameters \
        environment=$ENVIRONMENT \
        appName=$APP_NAME \
        dbAdminLogin=$ADMIN_LOGIN \
        dbAdminPassword="$DB_PASSWORD" \
    --verbose

echo -e "${GREEN}✅ Production infrastructure deployed successfully!${NC}"
echo ""

# Get deployment outputs
echo -e "${BLUE}📊 Production Deployment Summary:${NC}"
echo "=================================="

APP_SERVICE_URL=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name azure-infrastructure \
    --query properties.outputs.appServiceUrl.value -o tsv)

FUNCTION_APP_URL=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name azure-infrastructure \
    --query properties.outputs.functionAppUrl.value -o tsv)

DATABASE_HOST=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name azure-infrastructure \
    --query properties.outputs.databaseHost.value -o tsv)

KEY_VAULT_URL=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name azure-infrastructure \
    --query properties.outputs.keyVaultUrl.value -o tsv)

CDN_URL=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name azure-infrastructure \
    --query properties.outputs.cdnUrl.value -o tsv)

echo -e "${GREEN}🌐 App Service URL:${NC} $APP_SERVICE_URL"
echo -e "${GREEN}⚡ Function App URL:${NC} $FUNCTION_APP_URL"
echo -e "${GREEN}🗄️  Database Host:${NC} $DATABASE_HOST"
echo -e "${GREEN}🔐 Key Vault URL:${NC} $KEY_VAULT_URL"
echo -e "${GREEN}🌍 CDN URL:${NC} $CDN_URL"
echo ""

# Store secrets in Key Vault
echo -e "${BLUE}🔐 Storing secrets in Key Vault...${NC}"

# Get Key Vault name
KEY_VAULT_NAME=$(az keyvault list \
    --resource-group $RESOURCE_GROUP \
    --query "[0].name" -o tsv)

# Store database password
az keyvault secret set \
    --vault-name $KEY_VAULT_NAME \
    --name "database-password" \
    --value "$DB_PASSWORD"

# Store connection strings
az keyvault secret set \
    --vault-name $KEY_VAULT_NAME \
    --name "database-connection-string" \
    --value "postgresql://$ADMIN_LOGIN:$DB_PASSWORD@$DATABASE_HOST:5432/${APP_NAME}-${ENVIRONMENT}-db?sslmode=require"

# Store JWT secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

az keyvault secret set \
    --vault-name $KEY_VAULT_NAME \
    --name "jwt-secret" \
    --value "$JWT_SECRET"

az keyvault secret set \
    --vault-name $KEY_VAULT_NAME \
    --name "jwt-refresh-secret" \
    --value "$JWT_REFRESH_SECRET"

echo -e "${GREEN}✅ Secrets stored in Key Vault${NC}"
echo ""

# Deploy database schema
echo -e "${BLUE}🗄️  Deploying database schema...${NC}"

# Get database connection string
DB_CONNECTION_STRING="postgresql://$ADMIN_LOGIN:$DB_PASSWORD@$DATABASE_HOST:5432/${APP_NAME}-${ENVIRONMENT}-db?sslmode=require"

# Deploy schema
psql "$DB_CONNECTION_STRING" -f migration/azure-database-schema.sql

echo -e "${GREEN}✅ Database schema deployed${NC}"
echo ""

# Configure App Service settings
echo -e "${BLUE}⚙️  Configuring App Service...${NC}"

# Get App Service name
APP_SERVICE_NAME=$(az webapp list \
    --resource-group $RESOURCE_GROUP \
    --query "[0].name" -o tsv)

# Configure app settings
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_SERVICE_NAME \
    --settings \
        "AZURE_KEY_VAULT_URL=$KEY_VAULT_URL" \
        "ENVIRONMENT=$ENVIRONMENT" \
        "NODE_ENV=production" \
        "DATABASE_URL=$DB_CONNECTION_STRING" \
        "JWT_SECRET=$JWT_SECRET" \
        "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"

echo -e "${GREEN}✅ App Service configured${NC}"
echo ""

# Configure Function App settings
echo -e "${BLUE}⚙️  Configuring Function App...${NC}"

# Get Function App name
FUNCTION_APP_NAME=$(az functionapp list \
    --resource-group $RESOURCE_GROUP \
    --query "[0].name" -o tsv)

# Configure function app settings
az functionapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $FUNCTION_APP_NAME \
    --settings \
        "AZURE_KEY_VAULT_URL=$KEY_VAULT_URL" \
        "ENVIRONMENT=$ENVIRONMENT" \
        "FUNCTIONS_WORKER_RUNTIME=node" \
        "DATABASE_URL=$DB_CONNECTION_STRING" \
        "JWT_SECRET=$JWT_SECRET" \
        "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"

echo -e "${GREEN}✅ Function App configured${NC}"
echo ""

# Deploy Azure Functions
echo -e "${BLUE}⚡ Deploying Azure Functions...${NC}"

# Build and deploy functions
cd azure-functions
npm install
npm run build

# Deploy functions
func azure functionapp publish $FUNCTION_APP_NAME --typescript

cd ..

echo -e "${GREEN}✅ Azure Functions deployed${NC}"
echo ""

# Set up monitoring and alerts
echo -e "${BLUE}📊 Setting up monitoring and alerts...${NC}"

# Get Application Insights connection string
APP_INSIGHTS_CONNECTION_STRING=$(az deployment group show \
    --resource-group $RESOURCE_GROUP \
    --name azure-infrastructure \
    --query properties.outputs.applicationInsightsConnectionString.value -o tsv)

# Configure Application Insights
az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $APP_SERVICE_NAME \
    --settings \
        "APPLICATIONINSIGHTS_CONNECTION_STRING=$APP_INSIGHTS_CONNECTION_STRING"

az functionapp config appsettings set \
    --resource-group $RESOURCE_GROUP \
    --name $FUNCTION_APP_NAME \
    --settings \
        "APPLICATIONINSIGHTS_CONNECTION_STRING=$APP_INSIGHTS_CONNECTION_STRING"

echo -e "${GREEN}✅ Monitoring configured${NC}"
echo ""

# Set up SSL certificate
echo -e "${BLUE}🔒 Setting up SSL certificate...${NC}"

# Get custom domain (if provided)
read -p "Enter your custom domain (optional, press Enter to skip): " CUSTOM_DOMAIN

if [ ! -z "$CUSTOM_DOMAIN" ]; then
    # Add custom domain
    az webapp config hostname add \
        --resource-group $RESOURCE_GROUP \
        --webapp-name $APP_SERVICE_NAME \
        --hostname $CUSTOM_DOMAIN
    
    # Get SSL certificate
    az webapp config ssl create \
        --resource-group $RESOURCE_GROUP \
        --name $APP_SERVICE_NAME \
        --hostname $CUSTOM_DOMAIN
    
    echo -e "${GREEN}✅ SSL certificate configured for $CUSTOM_DOMAIN${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping SSL certificate setup${NC}"
fi

echo ""

# Create production deployment summary
cat > production-deployment-summary.md << EOF
# 🎉 Production Deployment Complete!

## Deployment Details
- **Resource Group**: $RESOURCE_GROUP
- **Location**: $LOCATION
- **Environment**: $ENVIRONMENT
- **Deployment Date**: $(date)

## Service URLs
- **App Service**: $APP_SERVICE_URL
- **Function App**: $FUNCTION_APP_URL
- **CDN**: $CDN_URL
- **Key Vault**: $KEY_VAULT_URL

## Database
- **Host**: $DATABASE_HOST
- **Database**: ${APP_NAME}-${ENVIRONMENT}-db
- **Admin**: $ADMIN_LOGIN

## Security
- **JWT Secret**: Configured in Key Vault
- **Database Password**: Stored in Key Vault
- **SSL Certificate**: $([ ! -z "$CUSTOM_DOMAIN" ] && echo "Configured for $CUSTOM_DOMAIN" || echo "Not configured")

## Next Steps
1. Deploy your application code to App Service
2. Configure custom domain and SSL
3. Set up monitoring and alerts
4. Configure backup and disaster recovery
5. Set up CI/CD pipeline

## Useful Commands
\`\`\`bash
# View all resources
az resource list --resource-group $RESOURCE_GROUP --output table

# View App Service logs
az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_SERVICE_NAME

# View Function App logs
az functionapp log tail --resource-group $RESOURCE_GROUP --name $FUNCTION_APP_NAME

# Scale App Service
az appservice plan update --resource-group $RESOURCE_GROUP --name ${APP_NAME}-${ENVIRONMENT}-plan --sku P2V2
\`\`\`
EOF

echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Deploy your application code to App Service"
echo "2. Configure custom domain and SSL"
echo "3. Set up monitoring and alerts"
echo "4. Configure backup and disaster recovery"
echo "5. Set up CI/CD pipeline"
echo ""
echo -e "${BLUE}📄 Production deployment summary saved to: production-deployment-summary.md${NC}"
echo ""
echo -e "${GREEN}🚀 Your civic engagement platform is now running in production on Azure!${NC}"
