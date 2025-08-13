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
- **Hosting**: AWS/Vercel or Docker

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