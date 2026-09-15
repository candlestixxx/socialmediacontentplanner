FROM node:18-alpine

WORKDIR /app

# Copy root configurations and workspace packages
COPY package*.json turbo.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/database/package.json ./packages/database/
COPY packages/social/package.json ./packages/social/
COPY packages/billing/package.json ./packages/billing/
COPY packages/ai/package.json ./packages/ai/
COPY packages/jobs/package.json ./packages/jobs/

RUN npm install

# Copy source code
COPY . .

# Build the API package (and its local dependencies via turbo if configured)
RUN npm run build --workspace=@contentcommand/api

WORKDIR /app/packages/api
EXPOSE 3031

CMD ["npm", "start"]
