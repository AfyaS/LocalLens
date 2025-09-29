#!/bin/bash

# Simple Azure Deployment Script
# Deploys infrastructure step by step

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

RESOURCE_GROUP="community-clarity-prod-rg"
LOCATION="eastus"
APP_NAME="community-clarity"
ENVIRONMENT="prod"
DB_PASSWORD="CivicEngagement2024!@#"

echo -e "${BLUE}🚀 Starting Azure Infrastructure Deployment${NC}"
echo "=================================================="

# 1. Create App Service Plan
echo -e "${BLUE}📦 Creating App Service Plan...${NC}"
az appservice plan create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-${ENVIRONMENT}-plan" \
  --location $LOCATION \
  --sku B1 \
  --is-linux

echo -e "${GREEN}✅ App Service Plan created${NC}"

# 2. Create Storage Account
echo -e "${BLUE}💾 Creating Storage Account...${NC}"
STORAGE_NAME="${APP_NAME}${ENVIRONMENT}$(date +%s | tail -c 6)"
az storage account create \
  --resource-group $RESOURCE_GROUP \
  --name $STORAGE_NAME \
  --location $LOCATION \
  --sku Standard_LRS

echo -e "${GREEN}✅ Storage Account created${NC}"

# 3. Create PostgreSQL Server
echo -e "${BLUE}🗄️  Creating PostgreSQL Server...${NC}"
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-${ENVIRONMENT}-postgres" \
  --location $LOCATION \
  --admin-user civicadmin \
  --admin-password "$DB_PASSWORD" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access 0.0.0.0-255.255.255.255 \
  --storage-size 32

echo -e "${GREEN}✅ PostgreSQL Server created${NC}"

# 4. Create PostgreSQL Database
echo -e "${BLUE}📊 Creating PostgreSQL Database...${NC}"
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name "${APP_NAME}-${ENVIRONMENT}-postgres" \
  --database-name "${APP_NAME}-${ENVIRONMENT}-db"

echo -e "${GREEN}✅ PostgreSQL Database created${NC}"

# 5. Create Key Vault
echo -e "${BLUE}🔐 Creating Key Vault...${NC}"
az keyvault create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-${ENVIRONMENT}-kv" \
  --location $LOCATION

echo -e "${GREEN}✅ Key Vault created${NC}"

# 6. Store secrets in Key Vault
echo -e "${BLUE}🔑 Storing secrets in Key Vault...${NC}"
az keyvault secret set \
  --vault-name "${APP_NAME}-${ENVIRONMENT}-kv" \
  --name "database-password" \
  --value "$DB_PASSWORD"

# Get storage key
STORAGE_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_NAME --query "[0].value" -o tsv)

az keyvault secret set \
  --vault-name "${APP_NAME}-${ENVIRONMENT}-kv" \
  --name "storage-account-key" \
  --value "$STORAGE_KEY"

echo -e "${GREEN}✅ Secrets stored in Key Vault${NC}"

# 7. Create App Service
echo -e "${BLUE}🌐 Creating App Service...${NC}"
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan "${APP_NAME}-${ENVIRONMENT}-plan" \
  --name "${APP_NAME}-${ENVIRONMENT}-app" \
  --runtime "NODE|18-lts"

echo -e "${GREEN}✅ App Service created${NC}"

# 8. Create Function App
echo -e "${BLUE}⚡ Creating Function App...${NC}"
az functionapp create \
  --resource-group $RESOURCE_GROUP \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name "${APP_NAME}-${ENVIRONMENT}-func" \
  --storage-account $STORAGE_NAME

echo -e "${GREEN}✅ Function App created${NC}"

# 9. Configure App Service settings
echo -e "${BLUE}⚙️  Configuring App Service...${NC}"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-${ENVIRONMENT}-app" \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="postgresql://civicadmin:$DB_PASSWORD@${APP_NAME}-${ENVIRONMENT}-postgres.postgres.database.azure.com:5432/${APP_NAME}-${ENVIRONMENT}-db?sslmode=require" \
    AZURE_KEY_VAULT_URL="https://${APP_NAME}-${ENVIRONMENT}-kv.vault.azure.net/"

echo -e "${GREEN}✅ App Service configured${NC}"

# 10. Configure Function App settings
echo -e "${BLUE}⚙️  Configuring Function App...${NC}"
az functionapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-${ENVIRONMENT}-func" \
  --settings \
    FUNCTIONS_WORKER_RUNTIME=node \
    DATABASE_URL="postgresql://civicadmin:$DB_PASSWORD@${APP_NAME}-${ENVIRONMENT}-postgres.postgres.database.azure.com:5432/${APP_NAME}-${ENVIRONMENT}-db?sslmode=require" \
    AZURE_KEY_VAULT_URL="https://${APP_NAME}-${ENVIRONMENT}-kv.vault.azure.net/"

echo -e "${GREEN}✅ Function App configured${NC}"

echo -e "${GREEN}🎉 Azure Infrastructure Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "=================================="
echo -e "${GREEN}🌐 App Service:${NC} https://${APP_NAME}-${ENVIRONMENT}-app.azurewebsites.net"
echo -e "${GREEN}⚡ Function App:${NC} https://${APP_NAME}-${ENVIRONMENT}-func.azurewebsites.net"
echo -e "${GREEN}🗄️  Database:${NC} ${APP_NAME}-${ENVIRONMENT}-postgres.postgres.database.azure.com"
echo -e "${GREEN}🔐 Key Vault:${NC} https://${APP_NAME}-${ENVIRONMENT}-kv.vault.azure.net/"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Deploy database schema"
echo "2. Deploy Azure Functions"
echo "3. Deploy application code"
echo "4. Configure monitoring"
