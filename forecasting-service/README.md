# Python Forecasting Service

## Setup

1. Create virtual environment:
```bash
python -m venv venv
```

2. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the service:
```bash
python app.py
```

The service will run on http://localhost:5001

## API Endpoints

- `GET /health` - Health check
- `POST /api/forecast/spending` - Predict future spending
- `POST /api/forecast/goal-probability` - Calculate goal achievement probability

## Environment Variables

- `PORT` - Port to run the service (default: 5001)
- `CLIENT_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `NODE_BACKEND_URL` - Node.js backend URL (default: http://localhost:5000)
