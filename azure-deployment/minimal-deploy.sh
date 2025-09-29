#!/bin/bash

# Minimal Azure Deployment Script
# Deploys only what's available without quota issues

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

echo -e "${BLUE}🚀 Starting Minimal Azure Deployment${NC}"
echo "=================================================="

# 1. Create Key Vault
echo -e "${BLUE}🔐 Creating Key Vault...${NC}"
az keyvault create \
  --resource-group $RESOURCE_GROUP \
  --name "civic${ENVIRONMENT}kv" \
  --location $LOCATION

echo -e "${GREEN}✅ Key Vault created${NC}"

# 2. Create Function App (Serverless)
echo -e "${BLUE}⚡ Creating Function App (Serverless)...${NC}"
az functionapp create \
  --resource-group $RESOURCE_GROUP \
  --consumption-plan-location $LOCATION \
  --runtime node \
  --runtime-version 22 \
  --functions-version 4 \
  --name "${APP_NAME}-${ENVIRONMENT}-func" \
  --storage-account civicprod39914

echo -e "${GREEN}✅ Function App created${NC}"

# 3. Configure Function App settings
echo -e "${BLUE}⚙️  Configuring Function App...${NC}"
az functionapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-${ENVIRONMENT}-func" \
  --settings \
    FUNCTIONS_WORKER_RUNTIME=node \
    NODE_ENV=production \
    AZURE_KEY_VAULT_URL="https://civic${ENVIRONMENT}kv.vault.azure.net/"

echo -e "${GREEN}✅ Function App configured${NC}"

# 4. Create Static Web App
echo -e "${BLUE}🌐 Creating Static Web App...${NC}"
az staticwebapp create \
  --resource-group $RESOURCE_GROUP \
  --name "${APP_NAME}-${ENVIRONMENT}-web" \
  --location $LOCATION

echo -e "${GREEN}✅ Static Web App created${NC}"

echo -e "${GREEN}🎉 Minimal Azure Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "=================================="
echo -e "${GREEN}⚡ Function App:${NC} https://${APP_NAME}-${ENVIRONMENT}-func.azurewebsites.net"
echo -e "${GREEN}🌐 Static Web App:${NC} https://${APP_NAME}-${ENVIRONMENT}-web.azurestaticapps.net"
echo -e "${GREEN}🔐 Key Vault:${NC} https://civic${ENVIRONMENT}kv.vault.azure.net/"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Deploy Azure Functions code"
echo "2. Deploy application code to Static Web App"
echo "3. Set up database (when quota allows)"
echo "4. Configure monitoring"
