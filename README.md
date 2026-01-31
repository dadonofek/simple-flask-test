# TBONTB - To Buy Or Not To Buy

A financial decision-making tool that uses Monte Carlo simulations to compare buying property vs. investing in the stock market.

This is a working Railway deployment with the frontend ready. Backend components will be added incrementally.

## Project Structure

```
.
├── frontend/           # Next.js frontend application
│   ├── app/           # Next.js pages and routes
│   ├── components/    # React components
│   ├── lib/           # Utility functions and API client
│   ├── types/         # TypeScript type definitions
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── main.py            # Simple Flask app (placeholder for backend)
├── requirements.txt   # Python dependencies
└── README.md          # This file
```

## Features

### Frontend (Currently Implemented)
- **Interactive Landing Page**: Overview of TBONTB with feature highlights
- **Simulation Configuration**:
  - Buying scenario (property purchase with mortgage)
  - Investment scenario (stock market portfolio)
  - Comparison mode (side-by-side analysis)
- **Advanced Monte Carlo Simulations**: Configure parameters like:
  - Financial profile (income, savings)
  - Property details (price, down payment, mortgage tracks)
  - Investment parameters (fees, taxes, returns)
  - Simulation settings (years, iterations)
- **Results Visualization**:
  - Interactive charts powered by Plotly.js
  - Median, pessimistic, and optimistic scenarios
  - IRR (Internal Rate of Return) calculations
  - Comparative analysis

### Backend (To Be Added Incrementally)
The backend will be added one component at a time to avoid Railway deployment issues:
1. Health check endpoint
2. Simple simulation endpoints
3. Full Monte Carlo simulation engine
4. Advanced features (mortgage calculator, parameter optimization)

## Tech Stack

### Frontend
- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS 4**: Modern utility-first CSS
- **Plotly.js**: Interactive data visualization
- **React Hook Form**: Form state management
- **Tanstack Query**: Server state management

### Backend (Planned)
- **FastAPI**: Modern Python web framework
- **NumPy**: Numerical computing
- **Pandas**: Data manipulation
- **Monte Carlo Engine**: Custom simulation algorithms

## Local Development

### Frontend Only (Current State)

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp frontend/.env.example frontend/.env.local
   # Edit .env.local to point to your backend (when ready)
   ```

3. **Run Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

   Visit http://localhost:3000

4. **Build for Production**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

### With Backend (Coming Soon)

1. **Install Python Dependencies**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Run Backend**
   ```bash
   python main.py
   ```

   Backend will run on http://localhost:8000

3. **Run Frontend** (in separate terminal)
   ```bash
   cd frontend
   npm run dev
   ```

## Deploy to Railway

### Current Setup: Frontend Only

1. **Create New Project on Railway**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose this repository

2. **Configure Frontend Service**
   - Railway will auto-detect the Next.js app in `/frontend`
   - Set the root directory to `/frontend`
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```
     (Update this when backend is deployed)

3. **Generate Domain**
   - Click "Generate Domain" to get your public URL

### Future: With Backend

1. **Add Backend Service**
   - In your Railway project, add a new service
   - Point to the same repository
   - Set root directory to `/`
   - Railway will detect the Python app

2. **Update Frontend Environment**
   - Update `NEXT_PUBLIC_API_URL` in frontend service
   - Point it to your backend service URL

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

### Backend (Coming Soon)
- `PORT`: Port to run on (Railway provides this automatically)
- Additional configuration as we add backend features

## API Endpoints (Planned)

The backend will expose these endpoints incrementally:

### Health & Info
- `GET /api/health` - Health check
- `GET /api/v1/info` - API information

### Simulations
- `POST /api/v1/simulate/buying` - Run buying scenario
- `POST /api/v1/simulate/investment` - Run investment scenario
- `POST /api/v1/simulate/compare` - Compare both scenarios

### Utilities
- `GET /api/v1/parameters/defaults` - Get default parameters
- `POST /api/v1/mortgage/preview` - Preview mortgage calculations

## Development Roadmap

- [x] Set up Next.js frontend with TBONTB UI
- [x] Configure Railway deployment for frontend
- [x] Test frontend build and deployment
- [ ] Add simple Flask backend with health check
- [ ] Implement basic simulation endpoints
- [ ] Add Monte Carlo simulation engine
- [ ] Integrate mortgage calculator
- [ ] Add data persistence (if needed)
- [ ] Performance optimization
- [ ] Production testing and monitoring

## Current Limitations

- Frontend is fully functional but backend API calls will fail
- Simulations cannot be run until backend is deployed
- The app shows the UI and accepts input but won't produce results yet

## Next Steps

1. Test the frontend deployment on Railway
2. Gradually add backend endpoints
3. Connect frontend to backend as services become available
4. Monitor Railway resource usage and optimize as needed

## Contributing

This is a work in progress. The strategy is to:
1. Deploy frontend first (working now)
2. Add backend incrementally to avoid resource issues
3. Test each component before adding the next

## License

See original TBONTB repository for license information.

## Credits

Based on the TBONTB (To Buy Or Not To Buy) project.
Frontend cloned from https://github.com/dadonofek/TBONTB
