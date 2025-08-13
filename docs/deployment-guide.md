# Propel22 Deployment Guide

This guide provides instructions for setting up and deploying the Propel22 platform in both development and production environments.

## Development Setup

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL (v12+)
- Git

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/propel22.git
cd propel22
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your local configuration.

3. **Initialize the database**

```bash
# Create PostgreSQL database
psql -U postgres -f database/init.sql
```

4. **Install dependencies**

```bash
npm run install-all
```

5. **Start the development server**

```bash
npm run dev
```

This will start both the client (React) and server (Node.js) in development mode.

- Client: http://localhost:3000
- Server: http://localhost:5000

## Production Deployment

### Option 1: Traditional Server Deployment

1. **Build the client**

```bash
npm run build
```

2. **Set up environment variables on your server**

Make sure to set `NODE_ENV=production` and configure all required variables.

3. **Start the production server**

```bash
npm start
```

### Option 2: Deployment to Vercel

1. **Deploy the client to Vercel**

```bash
cd client
npm install -g vercel
vercel login
vercel
```

Follow the prompts to deploy your frontend.

2. **Deploy the server to a hosting service**

You can deploy the server to services like Heroku, Digital Ocean, or AWS:

```bash
# Example for Heroku
cd server
heroku create propel22-api
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a propel22-api
git push heroku master
```

3. **Update the client API endpoint**

Update the API endpoint in your client to point to your deployed server.

### Option 3: Docker Deployment

1. **Build and run with Docker Compose**

```bash
docker-compose up -d
```

## Database Migrations

When making changes to the database schema:

```bash
# Generate a migration
cd server
npx sequelize-cli migration:generate --name add-new-field

# Run migrations
npx sequelize-cli db:migrate
```

## Troubleshooting

- **Database connection issues**: Verify PostgreSQL is running and credentials are correct
- **Port conflicts**: Check if ports 3000 or 5000 are already in use
- **Build errors**: Make sure all dependencies are installed correctly

## Maintenance

- Regularly update dependencies
- Monitor server logs for errors
- Back up the database regularly