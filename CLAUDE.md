# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Resume Optimization API is a Node.js/Express backend service that leverages Google Gemini AI (via LangChain) to optimize user resumes. Users authenticate via Firebase, upload resumes to AWS S3, and the API processes them through an AI service for optimization. The system tracks optimization history per user in MongoDB.

## Common Commands

### Development
- `npm run dev` - Start development server with auto-reload (watches src, compiles TypeScript on-the-fly via ts-node)
- `npm run build` - Compile TypeScript to JavaScript in `dist/`
- `npm start` - Run compiled JavaScript server

### Testing
- `npm test` - Run all tests (Jest)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:unit` - Run only unit tests (`tests/unit/`)
- `npm run test:integration` - Run only integration tests (currently not implemented)

### Code Quality
- `npm run lint` - Run ESLint on src and tests
- `npm run lint:fix` - Auto-fix linting issues

## Architecture

### High-Level Flow
1. **Authentication**: Firebase token validation via `authMiddleware` on all routes
2. **File Upload**: Resume files (PDF/Word) → S3 via `uploadMiddleware` → stored with user email prefix
3. **Text Extraction**: Extract text from uploaded file using PDF parser or Mammoth (Word docs)
4. **AI Optimization**: Send extracted text + target role + job descriptions to Google Gemini via LangChain chain
5. **History Persistence**: Store original and optimized resume in MongoDB under user document

### Directory Structure
```
src/
├── server.ts              # Entry point; initializes DB connection and starts Express
├── app.ts                 # Express app setup (middleware, routes, error handling)
├── health.ts              # Health check endpoint
├── controllers/           # Request handlers (uploadResume, optimizeResume, getUserHistory)
├── services/              # Business logic layers
│   ├── aiService.ts       # LangChain + Gemini AI chains for resume optimization
│   ├── s3Service.ts       # AWS S3 upload/download operations
│   └── textExtractionService.ts  # Extract text from PDF/Word files
├── model/
│   └── upload/            # Mongoose schemas and operations
│       ├── userSchema.ts  # User document structure
│       └── UploadModel.ts # CRUD operations
├── middleware/
│   ├── authMiddleware.ts  # Firebase token verification
│   ├── uploadMiddleware.ts # Multer file upload handler
│   └── rateLimiter.ts     # Express rate limiting
├── route/
│   └── resumeRoute.ts     # Route definitions (/api/v1/resumes)
├── config/                # External service configuration
│   ├── dbConfig.ts        # MongoDB connection
│   ├── firebaseConfig.ts  # Firebase Admin SDK
│   └── s3Cofig.ts         # AWS S3 client
└── utils/
    ├── catchAsync.ts      # Wrapper for async route handlers (error handling)
    └── pdfparser.ts       # PDF parsing utilities
```

### Key Architectural Patterns

**Service Layer**: Business logic is isolated in `services/` (aiService, s3Service, textExtractionService). Controllers orchestrate services and manage HTTP concerns.

**Error Handling**: `catchAsync()` wrapper in controllers automatically catches async errors and passes them to Express error middleware without try-catch boilerplate.

**Rate Limiting**: Two separate limiters:
- `uploadLimiter`: Restricts resume uploads
- `aiLimiter`: Restricts AI optimization calls (expensive operation)

**AI Chain Pattern**: LangChain's RunnableSequence chains prompt templates → Gemini model → output parser. Supports both basic optimization and structured analysis modes (see `analyzeResumeAI` in aiService.ts).

**Authentication**: All routes require Firebase token. Token extracts `email` and `uid` for user context.

## Environment Variables

Required for operation:
```
MONGO_URL        # MongoDB Atlas or local connection string
GOOGLE_API_KEY   # Google Gemini API key (get from Google AI Studio)
GOOGLE_PROJECT_ID # Firebase project ID
AWS_REGION       # e.g., "us-east-1"
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME  # S3 bucket for resume storage
NODE_ENV         # "development" or "production"
PORT             # Server port (default 8000)
```

## Testing Structure

- `tests/setup.ts` - Global test configuration (runs before test suite)
- `tests/unit/` - Unit tests for individual functions (validators, middleware, services)
- `tests/mocks/` - Mock data and Firebase/database mocks
- `tests/helpers/` - Test utilities

Tests use Jest with TypeScript (`ts-jest`), Sinon for spies/stubs, and supertest for HTTP assertions. Run `npm run test:watch` during development.

## Important Notes

- **TypeScript Config**: `strict: false` (lenient; some implicit `any` allowed). Consider upgrading for type safety.
- **API Version**: All routes prefixed with `/api/v1/` for future versioning.
- **CORS**: Hardcoded to specific origins (frontend deployed on Vercel, localhost:5173 for dev).
- **File Size Limit**: Express JSON payload capped at 10MB.
- **Resume File Formats**: Supports PDF (via pdf-parse) and Word (via Mammoth).
- **S3 Structure**: Files stored as `resumes/{email}/{timestamp}-{filename}` for organization.
- **Gemini Model**: Uses `gemini-2.0-flash-lite-001` (fast, cost-effective). System prompt emphasizes CAR format (Challenge → Action → Result) bullets with metrics.

## Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes in `src/`
3. Run `npm run lint:fix` to auto-format
4. Add/update tests in `tests/unit/`
5. Run `npm test` to verify
6. Commit with clear messages
