# Resume Optimization Application
Welcome to the app for resume optimization . This application build for optimizate the resume base on user requirement source by AI Model.

## Project Overview 

### Resume Optimization Application Architecture 
![Alt Text](./src/assets/resume-op.png)

## Features 
- Login page where user authenticated by google
- single page applicaton 
- state manaagement - userinfo Persisted
- You can upload resume both pdf and word file.

## Geeting Started
## Prerequisits 
- Nodejs(16+)
- NPM

## Setup Instructions
1. Clone the repository:

   ```bash
   git clone https://github.com/abishkar123/Resume-optimization-api.git
   
   ```
2. Clone the repository:
   ```bash
   cd api
   npm install
   ```

3. Running the Application 
   ```bash
   npm run dev 
   ```
4. Run the test
   ```bash
   npm test
   ```

## Project Strcuture 

- src/: Contain the soruce code of the application.
 - compontents/:  all custom components ex-Header, private router
 - page/: contain all pages such a home and upload page
 - private-route: route the page based on authentication
 - useAuth:/ contain state management for user
 - helper:/ this folder have fetch frontend api.
 - tests:/ there three different test, for each page and api.

## Container Deployment to Azure App Service

The API is container-ready for Azure App Service for Containers.

### Local Container Check

Build and run the image locally:

```bash
docker build -t resume-optimization-api:local .
docker run --env-file .env -p 8000:8000 resume-optimization-api:local
```

Verify the container health endpoint:

```bash
curl http://localhost:8000/health
```

### Azure Resources

Recommended defaults:

- Resource group: `rg-resume-op-prod`
- Region: `australiaeast`
- Azure Container Registry: `acrresumeopprod`
- App Service Plan: `asp-resume-op-prod`
- Web App: `app-resume-op-api-prod`
- Image name: `resume-optimization-api`

Create new resources:

```bash
az group create --name rg-resume-op-prod --location australiaeast
az acr create --resource-group rg-resume-op-prod --name acrresumeopprod --sku Basic
az appservice plan create --resource-group rg-resume-op-prod --name asp-resume-op-prod --is-linux --sku B1
az webapp create --resource-group rg-resume-op-prod --plan asp-resume-op-prod --name app-resume-op-api-prod --deployment-container-image-name acrresumeopprod.azurecr.io/resume-optimization-api:latest
az webapp identity assign --resource-group rg-resume-op-prod --name app-resume-op-api-prod
```

Grant the Web App permission to pull from ACR:

```bash
PRINCIPAL_ID=$(az webapp identity show --resource-group rg-resume-op-prod --name app-resume-op-api-prod --query principalId --output tsv)
ACR_ID=$(az acr show --resource-group rg-resume-op-prod --name acrresumeopprod --query id --output tsv)
az role assignment create --assignee "$PRINCIPAL_ID" --scope "$ACR_ID" --role AcrPull
```

If the Azure resources already exist, use the existing resource group, ACR, and Web App names in the GitHub variables below and confirm the Web App identity has `AcrPull` access to the ACR.

### App Service Settings

Configure these settings in Azure App Service:

```bash
az webapp config appsettings set \
  --resource-group rg-resume-op-prod \
  --name app-resume-op-api-prod \
  --settings \
    NODE_ENV=production \
    PORT=8000 \
    WEBSITES_PORT=8000 \
    MONGO_URL="<mongodb-connection-string>" \
    GOOGLE_API_KEY="<google-api-key>" \
    GOOGLE_PROJECT_ID="<firebase-project-id>" \
    AWS_REGION="<aws-region>" \
    AWS_ACCESS_KEY_ID="<aws-access-key-id>" \
    AWS_SECRET_ACCESS_KEY="<aws-secret-access-key>" \
    AWS_BUCKET_NAME="<aws-bucket-name>"
```

Configure the health check path:

```bash
az webapp config set --resource-group rg-resume-op-prod --name app-resume-op-api-prod --generic-configurations '{"healthCheckPath":"/health"}'
```

### GitHub Actions Deployment

The deployment workflow is `.github/workflows/deploy-azure-app-service-container.yml`. It runs on pushes to `main` and can also be started manually.

Create a Microsoft Entra app registration or managed identity with federated credentials for GitHub Actions OIDC, then configure these repository variables:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`
- `AZURE_RESOURCE_GROUP`
- `AZURE_WEBAPP_NAME`
- `AZURE_ACR_NAME`

The workflow builds, tests, compiles TypeScript, builds the Docker image, pushes it to ACR with the Git SHA and `latest` tags, then deploys the SHA-tagged image to Azure App Service.

## Notes

 ## Dev Dependencies
- nodemon: Tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected
  