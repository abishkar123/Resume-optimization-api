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

## Azure App Service Deployment

The API is configured for direct deployment to Azure App Service as a Node.js application.

### Azure Resources

Recommended defaults:

- Resource group: `resume-op-rg`
- Region: `australiaeast`
- App Service Plan: `asp-resume-op-prod`
- Web App: `resume-op-app`

Create new resources:

```bash
az group create --name resume-op-rg --location australiaeast
az appservice plan create --resource-group resume-op-rg --name asp-resume-op-prod --is-linux --sku B1
az webapp create --resource-group resume-op-rg --plan asp-resume-op-prod --name resume-op-app --runtime "NODE:22-lts"
```

If the app is still configured as a container web app, switch it back to a code-based Node app before deploying:

```bash
az webapp config set --resource-group resume-op-rg --name resume-op-app --linux-fx-version "NODE|22-lts"
az webapp config appsettings delete --resource-group resume-op-rg --name resume-op-app --setting-names DOCKER_REGISTRY_SERVER_URL DOCKER_REGISTRY_SERVER_USERNAME DOCKER_REGISTRY_SERVER_PASSWORD WEBSITES_PORT
```

### App Service Settings

Configure these settings in Azure App Service:

```bash
az webapp config appsettings set \
  --resource-group resume-op-rg \
  --name resume-op-app \
  --settings \
    NODE_ENV=production \
    PORT=8000 \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
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
az webapp config set --resource-group resume-op-rg --name resume-op-app --generic-configurations '{"healthCheckPath":"/health"}'
```

### GitHub Actions Deployment

The deployment workflow is `.github/workflows/deploy-azure-app-service.yml`. It runs on pushes to `main` and can also be started manually.

Create a Microsoft Entra app registration or managed identity with federated credentials for GitHub Actions OIDC, then configure these repository variables:

- `AZURE_CLIENT_ID`
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

The workflow builds, tests, compiles TypeScript, publishes a deployment package to `./publish`, uploads it as an artifact, then downloads and deploys that artifact to Azure App Service.

## Notes

 ## Dev Dependencies
- nodemon: Tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected
  
