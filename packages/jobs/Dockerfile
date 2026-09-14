FROM node:18-alpine

WORKDIR /app

# Copy root configurations and workspace packages
COPY package*.json turbo.json ./
COPY packages/jobs/package.json ./packages/jobs/
COPY packages/database/package.json ./packages/database/
COPY packages/social/package.json ./packages/social/
COPY packages/billing/package.json ./packages/billing/
COPY packages/ai/package.json ./packages/ai/
COPY packages/api/package.json ./packages/api/

RUN npm install

# Copy source code
COPY . .

# Build the Jobs package
RUN npm run build --workspace=@contentcommand/jobs

WORKDIR /app/packages/jobs

CMD ["npm", "start"]
