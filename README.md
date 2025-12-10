# FinBuddy 💰

A comprehensive financial management application with AI-powered insights and forecasting capabilities.

## 🚀 Quick Start with Docker

The easiest way to run FinBuddy is using Docker and Docker Compose.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- MongoDB Atlas account (or any MongoDB instance)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinBuddy
   ```

2. **Configure environment variables**
   
   Copy the example environment file and update with your values:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB Atlas connection string and API keys:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   JWT_SECRET=your-secret-key
   GROQ_API_KEY=your-groq-api-key
   ```

3. **Build and start all services**
   ```bash
   docker-compose up --build
   ```
   
   Or run in detached mode:
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - **Frontend**: http://localhost
   - **Backend API**: http://localhost:5000
   - **Forecasting Service**: http://localhost:5001

### Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Rebuild after code changes
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

## 📦 Services

### Backend (Node.js/Express)
- **Port**: 5000
- **Tech**: Node.js, Express, MongoDB, Socket.IO
- **Features**: REST API, WebSocket for real-time updates, JWT authentication

### Frontend (React/Vite)
- **Port**: 80
- **Tech**: React, Vite, Tailwind CSS, Recharts
- **Features**: SPA with client-side routing, real-time data updates

### Forecasting Service (Python/Flask)
- **Port**: 5001
- **Tech**: Python, Flask, Prophet
- **Features**: ML-based spending forecasts, goal probability analysis

## 🛠️ Development

### Running Services Individually

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Forecasting Service
```bash
cd forecasting-service
pip install -r requirements.txt
python app.py
```

### Environment Variables

Each service requires specific environment variables. See `.env.example` files in each directory:
- `/backend/.env.example`
- `/frontend/.env.example`
- `/forecasting-service/.env.example`

## 🏗️ Architecture

```
FinBuddy/
├── backend/              # Node.js/Express API
├── frontend/             # React/Vite SPA
├── forecasting-service/  # Python/Flask ML service
└── docker-compose.yml    # Orchestration
```

## 🔧 Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### MongoDB connection issues
- Verify your MongoDB Atlas connection string in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Check network access settings in MongoDB Atlas

### Port conflicts
If ports 80, 5000, or 5001 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change host port (left side)
```

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
