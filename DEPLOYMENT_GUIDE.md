# Docker & Azure Deployment Guide

## Table of Contents
1. [Local Docker Testing](#local-docker-testing)
2. [Azure Setup](#azure-setup)
3. [Deploy to Azure](#deploy-to-azure)
4. [Verification & Troubleshooting](#verification--troubleshooting)

---

## Local Docker Testing

### Prerequisites
- Docker Desktop installed
- Docker CLI available in terminal

### Build and Run Locally

#### Step 1: Create `.env.local` file
```bash
cp .env .env.local
# Edit .env.local with your credentials
```

#### Step 2: Build Docker image
```bash
docker build -t resume-api:latest .
```

#### Step 3: Run container with compose
```bash
docker-compose up
```

This starts:
- API on `http://localhost:8000`
- MongoDB on `localhost:27017`

#### Step 4: Test the API
```bash
curl http://localhost:8000/api/v1/resumes
```

#### Step 5: View logs
```bash
docker-compose logs -f api
```

#### Stop and cleanup
```bash
docker-compose down
docker-compose down -v  # Also remove volumes
```

---

## Azure Setup

### Prerequisites
- Azure subscription
- Azure CLI installed
- Azure DevOps project created
- Permissions to create resources

### Step 1: Create Azure Container Registry (ACR)

```bash
# Set variables
RESOURCE_GROUP="resume-api-rg"
REGISTRY_NAME="resumeapiregistry"  # Must be globally unique
LOCATION="eastus"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create container registry
az acr create --resource-group $RESOURCE_GROUP \
  --name $REGISTRY_NAME --sku Basic --admin-enabled true
```

### Step 2: Create Azure App Service Plan & App Service

```bash
# Set variables
APP_PLAN_NAME="resume-api-plan"
APP_SERVICE_NAME="resume-api-service"

# Create App Service Plan (Linux, for containers)
az appservice plan create \
  --name $APP_PLAN_NAME \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App for Containers
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_PLAN_NAME \
  --name $APP_SERVICE_NAME \
  --deployment-container-image-name-user "YOUR_ACR_NAME" \
  --deployment-container-image-name "resume-api:latest"
```

### Step 3: Configure App Service with ACR

```bash
# Get ACR credentials
REGISTRY_URL="$REGISTRY_NAME.azurecr.io"
REGISTRY_USERNAME=$(az acr credential show -n $REGISTRY_NAME --query username -o tsv)
REGISTRY_PASSWORD=$(az acr credential show -n $REGISTRY_NAME --query passwords[0].value -o tsv)

# Configure App Service to pull from ACR
az webapp config container set \
  --name $APP_SERVICE_NAME \
  --resource-group $RESOURCE_GROUP \
  --docker-custom-image-name "$REGISTRY_URL/resume-api:latest" \
  --docker-registry-server-url "https://$REGISTRY_URL" \
  --docker-registry-server-user $REGISTRY_USERNAME \
  --docker-registry-server-password $REGISTRY_PASSWORD
```

### Step 4: Set Environment Variables in App Service

```bash
# Set all required environment variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_SERVICE_NAME \
  --settings \
  NODE_ENV="production" \
  PORT="8000" \
  MONGO_URL="your_mongodb_connection_string" \
  FIREBASE_PROJECT_ID="your_project_id" \
  FIREBASE_PRIVATE_KEY="your_private_key" \
  FIREBASE_CLIENT_EMAIL="your_email" \
  AWS_ACCESS_KEY_ID="your_access_key" \
  AWS_SECRET_ACCESS_KEY="your_secret_key" \
  AWS_REGION="us-east-1" \
  GOOGLE_API_KEY="your_google_api_key"
```

### Step 5: Configure Azure DevOps Pipeline

#### In Azure DevOps:

1. **Create Service Connection to ACR**
   - Project Settings → Service connections → New service connection
   - Type: Docker Registry
   - Select: Azure Container Registry
   - Choose your ACR
   - Give it a name (remember this for `dockerRegistryServiceConnection`)

2. **Create Service Connection to Azure**
   - Project Settings → Service connections → New service connection
   - Type: Azure Resource Manager
   - Select: Service principal (automatic)
   - Choose your subscription
   - Give it a name (remember this for `AZURE_SUBSCRIPTION`)

#### Update `azure-pipelines.yml`:
Edit the file and replace these placeholders:

```yaml
variables:
  dockerRegistryServiceConnection: 'YOUR_ACR_CONNECTION_NAME'  # From step 1
  containerRegistry: 'resumeapiregistry.azurecr.io'  # Your ACR URL
  # ... other variables
```

In deployment stage:

```yaml
- task: AzureWebAppContainer@1
  inputs:
    azureSubscription: 'YOUR_SUBSCRIPTION_CONNECTION_NAME'  # From step 2
    appName: 'resume-api-service'  # Your App Service name
```

---

## Deploy to Azure

### Step 1: Push Code to Azure DevOps Repository

```bash
git remote add azure https://dev.azure.com/YOUR_ORG/YOUR_PROJECT/_git/resume-api
git push azure main
```

### Step 2: Add Pipeline to Repository

```bash
# Copy the pipeline file to repository
git add azure-pipelines.yml
git commit -m "Add Azure Pipeline configuration"
git push azure main
```

### Step 3: Create Pipeline in Azure DevOps

1. Go to Pipelines → New pipeline
2. Select: Azure Repos Git
3. Select your repository
4. Select: Existing Azure Pipelines YAML file
5. Path: `/azure-pipelines.yml`
6. Click Save

### Step 4: Run Pipeline

1. Go to Pipelines → Your pipeline
2. Click "Run pipeline"
3. Select branch: `main`
4. Click "Run"

Monitor the build in real-time. On success, app deploys automatically.

---

## Verification & Troubleshooting

### Check Deployment Status

```bash
# View App Service status
az webapp show --name resume-api-service --resource-group resume-api-rg

# View container logs
az webapp log tail --name resume-api-service --resource-group resume-api-rg

# View recent deployments
az webapp deployment list --name resume-api-service --resource-group resume-api-rg
```

### Test the Deployed API

```bash
curl https://resume-api-service.azurewebsites.net/api/v1/resumes
```

### Common Issues

#### Issue: Container fails to start
- Check logs: `az webapp log tail ...`
- Verify environment variables are set
- Ensure MongoDB URL is accessible from Azure

#### Issue: Database connection refused
- Check MongoDB connection string
- Ensure your IP/service is whitelisted in MongoDB Atlas
- For private MongoDB, use VNet integration

#### Issue: Image not found in ACR
- Verify image was pushed: `az acr repository list --name $REGISTRY_NAME`
- Check build logs in Azure DevOps
- Verify credentials in App Service container settings

#### Issue: Port binding issues
- App Service always maps port 8000 (ensure app listens on 8000)
- External traffic comes through HTTPS on 443 → 8000 internally

### View Logs

```bash
# Stream logs
az webapp log tail --name resume-api-service --resource-group resume-api-rg --follow

# Download logs
az webapp log download --name resume-api-service --resource-group resume-api-rg
```

### Redeploy Latest Version

```bash
# If pipeline is set up, just push to main
git push azure main

# Or manually:
az webapp config container set \
  --name resume-api-service \
  --resource-group resume-api-rg \
  --docker-custom-image-name "$REGISTRY_URL/resume-api:latest" \
  --docker-registry-server-url "https://$REGISTRY_URL" \
  --docker-registry-server-user $REGISTRY_USERNAME \
  --docker-registry-server-password $REGISTRY_PASSWORD
```

---

## Next Steps

- Set up auto-scaling: `az appservice plan update --sku B2`
- Enable Application Insights for monitoring
- Set up continuous monitoring and alerts
- Configure custom domain
- Enable HTTPS with managed certificates
