# Resume Optimization API

Node.js and TypeScript API for resume upload, text extraction, AI-driven optimization, and storage integration.

## Overview

This repository contains the backend for the Resume Optimization application. It handles:

- authenticated resume uploads
- PDF and DOC/DOCX text extraction
- AI-assisted resume analysis and optimization
- S3 storage integration
- Firebase-based authentication
- request rate limiting and security middleware

## Project Diagram

### Resume Optimization Application Architecture
![Alt Text](./src/assets/resume-op.png)

## Architecture

- `src/controllers` - HTTP request handlers
- `src/services` - business logic and external integrations
- `src/middleware` - auth, rate limiting, and upload handling
- `src/config` - database, Firebase, and S3 configuration
- `src/model` - persistence models
- `src/route` - route registration
- `src/utils` - shared helpers
- `tests` - unit test coverage and mocks

## Requirements

- Node.js 16 or newer
- npm

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables in `.env`.

3. Start the development server:

   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - start the API with auto-reload
- `npm run build` - compile TypeScript to `dist`
- `npm start` - run the compiled server from `dist`
- `npm run lint` - run ESLint across `src` and `tests`
- `npm run lint:fix` - automatically fix lint issues where possible
- `npm test` - run the full Jest test suite
- `npm run test:unit` - run unit tests only
- `npm run test:integration` - run integration tests only
- `npm run test:coverage` - generate coverage reports

## Testing and Quality

This repository now includes ESLint-based linting alongside Jest tests. Run these before opening a pull request:

```bash
npm run lint
npm test
npm run build
```

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

- Uploaded files and generated artifacts are excluded from source control.
- The repository is currently backend-only; frontend concerns are handled elsewhere.
