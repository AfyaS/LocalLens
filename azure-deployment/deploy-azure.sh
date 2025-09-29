#!/bin/bash

# Azure Deployment Script for Community Clarity AI
# This script deploys the complete Azure infrastructure

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="community-clarity-rg"
LOCATION="eastus"
ENVIRONMENT="dev"
APP_NAME="community-clarity"
ADMIN_LOGIN="civicadmin"

echo -e "${BLUE}🚀 Azure Deployment Script for Community Clarity AI${NC}"
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

# Create resource group
echo -e "${BLUE}📦 Creating resource group: $RESOURCE_GROUP${NC}"
az group create \
    --name $RESOURCE_GROUP \
    --location $LOCATION \
    --tags Environment=$ENVIRONMENT Project="Community Clarity AI"

echo -e "${GREEN}✅ Resource group created${NC}"
echo ""

# Deploy infrastructure
echo -e "${BLUE}🏗️  Deploying Azure infrastructure...${NC}"
echo "This may take 10-15 minutes..."

az deployment group create \
    --resource-group $RESOURCE_GROUP \
    --template-file azure-infrastructure.bicep \
    --parameters \
        environment=$ENVIRONMENT \
        appName=$APP_NAME \
        dbAdminLogin=$ADMIN_LOGIN \
        dbAdminPassword="$DB_PASSWORD" \
    --verbose

echo -e "${GREEN}✅ Infrastructure deployed successfully!${NC}"
echo ""

# Get deployment outputs
echo -e "${BLUE}📊 Deployment Summary:${NC}"
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

echo -e "${GREEN}✅ Secrets stored in Key Vault${NC}"
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
        "NODE_ENV=production"

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
        "FUNCTIONS_WORKER_RUNTIME=node"

echo -e "${GREEN}✅ Function App configured${NC}"
echo ""

# Create deployment summary
cat > deployment-summary.md << EOF
# 🎉 Azure Deployment Complete!

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

## Next Steps
1. Deploy your application code to App Service
2. Deploy Azure Functions for backend services
3. Configure CI/CD pipeline
4. Set up monitoring and alerts

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

echo -e "${GREEN}🎉 Azure deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Deploy your application code to App Service"
echo "2. Deploy Azure Functions for backend services"
echo "3. Configure CI/CD pipeline"
echo "4. Set up monitoring and alerts"
echo ""
echo -e "${BLUE}📄 Deployment summary saved to: deployment-summary.md${NC}"
echo ""
echo -e "${GREEN}🚀 Your civic engagement platform is now running on Azure!${NC}"
