# Propel22 - Automated Joint Business Planning & Bookkeeping Platform

Propel22 is a SaaS partnership management platform that automates joint business plan creation, P&L tracking, KPI monitoring, and partner evaluation.

## Features

- **Multi-company/partner support**: Custom profiles, metrics, commissions, and cost data
- **Real-time calculations**: ARR, revenue, commissions, funnels, profitability
- **Bookkeeping**: Track actuals vs. plan, show variances
- **Partner evaluation scoring**: Weighted scoring system
- **Exportable reports**: Plans, contracts in PDF/Excel formats

## Key Modules

1. **Company/Partner Profile Setup**
2. **Joint Business Plan Workflow**
3. **Bookkeeping & Tracking**
4. **Partner Evaluation Matrix**
5. **Dashboards & Reports**
6. **Document Generation & Integration**

## Tech Stack

- **Frontend**: React.js with Material UI
- **Backend**: Node.js/Express
- **Database**: PostgreSQL
- **Hosting**: Railway, AWS, Vercel or Docker

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- PostgreSQL

### Quick Setup

#### Windows

```powershell
# Run the setup script
.\setup.ps1
```

#### Unix/Mac

```bash
# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

## Railway Deployment

This project is configured for easy deployment on Railway. Follow these steps to deploy:

1. **Fork or Clone the Repository**
   - Ensure you have the latest code with all fixes

2. **Create a Railway Account**
   - Sign up at [Railway.app](https://railway.app/)

3. **Create a New Project**
   - From the Railway dashboard, create a new project
   - Choose "Deploy from GitHub repo"
   - Select your Propel22 repository

4. **Add PostgreSQL Database**
   - Click "+ New Service" in your project
   - Select "Database" → "PostgreSQL"
   - Wait for the database to be provisioned

5. **Configure Environment Variables**
   - In your web service, go to the "Variables" tab
   - Add the following variables:
     ```
     NODE_ENV=production
     JWT_SECRET=your_secure_random_string
     PORT=5000
     ```
   - Railway will automatically add the `DATABASE_URL` variable

6. **Deploy the Application**
   - Railway will automatically deploy your application
   - Monitor the deployment logs for any issues

7. **Access Your Application**
   - Once deployed, click on "Generate Domain" to get a public URL
   - Your application will be available at the generated domain

### Manual Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/propel22.git
cd propel22
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

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

## Deployment Options

### Option 1: Traditional Server Deployment

```bash
# Build the client
npm run build

# Start the production server
npm start
```

### Option 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Option 3: Cloud Deployment

See the [Deployment Guide](docs/deployment-guide.md) for detailed instructions on deploying to AWS, Vercel, or other cloud providers.

## Project Structure

```
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # React components
│       └── ...            
├── server/                 # Node.js backend
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   └── ...                
├── database/               # Database scripts
├── docs/                   # Documentation
└── ...                    
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.