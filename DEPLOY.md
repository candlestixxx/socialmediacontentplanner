# Deployment Instructions for ContentCommand AI

## Local Development (Docker)

To spin up the required local infrastructure (PostgreSQL and Redis), ensure Docker is running, then execute:

```bash
docker-compose up -d
```

### Environment Variables
Copy the `.env.example` file to `.env` in the `packages/database` folder.
Ensure the Prisma connection string matches the local Docker config:
`DATABASE_URL="postgresql://postgres:password@localhost:5432/contentcommand?schema=public"`

Ensure the Redis URL in your root `.env` or `packages/jobs/.env` matches:
`REDIS_URL="redis://127.0.0.1:6379"`

### Bootstrapping the Database
Once the Postgres container is running, push the Prisma schema:
```bash
cd packages/database
npx prisma db push
```

## Production Deployment

### Database (PostgreSQL)
- We recommend managed PostgreSQL instances such as AWS RDS, Supabase, or Vercel Postgres.
- Ensure the connection pool string is provided in the production environment variables.

### Cache & Queues (Redis)
- We recommend Upstash or AWS ElastiCache for production Redis.
- Used by BullMQ for scheduled social media posting.

### Web Client (Next.js)
- The Next.js client (`apps/web`) is optimized for deployment on **Vercel**.
- Connect the GitHub repository directly to Vercel, set the Root Directory to `apps/web`.
- Make sure to populate `NEXT_PUBLIC_API_URL` to point to your live Express backend.

### Backend API (Express)
- The Express server (`packages/api`) can be deployed to AWS Elastic Beanstalk, Heroku, or Render.
- Set `PORT` to the provider's requirement (default is 3001).
