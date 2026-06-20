# Cybership Carrier Integration Service

A robust, extensible backend service built in TypeScript that integrates with shipping carriers (starting with UPS) to provide normalized real-time rates.

## 🏗️ Architecture & Design Decisions

The core philosophy behind this service is **Extensibility** and **Separation of Concerns**. If we need to add FedEx or DHL tomorrow, we shouldn't have to touch the existing UPS logic.

1. **Domain-Driven Design (`src/domain/`)**: I created a unified internal boundary (`RateRequest`, `RateQuote`) using `zod`. This ensures the core system never has to care about the proprietary JSON structures of individual carriers. Zod also provides strict runtime validation before any external HTTP calls are made.
2. **Isolated Carrier Implementations (`src/carriers/ups/`)**: The UPS logic is strictly contained. It implements the standard `CarrierIntegration` interface.
   - **Mapper**: Translates between our domain models and UPS's specific JSON shapes.
   - **Auth Client**: Manages the OAuth 2.0 Client Credentials flow. It acts as a Singleton in memory, caching the token and utilizing a 60-second expiry buffer to seamlessly refresh tokens without interrupting inflight requests.
3. **Structured Error Handling (`src/utils/errors.ts`)**: Instead of throwing generic HTTP errors, the system catches Axios exceptions and Zod validation errors, transforming them into structured custom classes (e.g., `AuthenticationError`, `RateLimitError`). This provides actionable feedback to the client.

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and add your credentials (though the system will run with dummy credentials to demonstrate error handling):
   ```bash
   cp .env.example .env
   ```

### Execution
To run the CLI demonstration (which sends a unified rate request through the UPS integration):
```bash
npm start
```

## 🧪 Running Integration Tests

The test suite uses **Jest** and **Nock** to stub network requests, verifying the logic end-to-end without requiring live UPS API credentials.
```bash
npm test
```

## 🔮 What I Would Improve Given More Time

If I had more time to expand this into a production-ready module, I would implement:
1. **Distributed Caching (Redis)**: Currently, the OAuth token is cached in memory. In a multi-instance microservices environment, I would move this to Redis so all instances share the same active token.
2. **Professional Logging**: Replace `console.log` with a structured logging library like `Winston` or `Pino` to track `transId` properly in production tools like Datadog or ELK.
3. **Advanced Rate Limiting & Retry Logic**: Implement an exponential backoff strategy for handling 429 (Rate Limit) and 5xx (Server Error) responses seamlessly.
4. **Enhanced Domain Models**: Expand the unified `RateRequest` to support edge cases like Hazmat (hazardous materials) flags, customs documentation for international shipments, and specific delivery windows.