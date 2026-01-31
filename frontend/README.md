# TBONTB Frontend

Next.js frontend for the TBONTB (To Buy Or Not To Buy) application.

## Overview

This is a modern Next.js 16 application with TypeScript, TailwindCSS, and Plotly for interactive visualizations. It provides a user-friendly interface for Monte Carlo financial simulations.

## Tech Stack

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS 4**: Utility-first CSS framework
- **Plotly.js**: Interactive charts and visualizations
- **React Hook Form**: Form state management with validation
- **Tanstack Query**: Server state and caching
- **Zustand**: Client state management

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Landing page
│   ├── simulate/
│   │   └── page.tsx       # Main simulation page
│   └── globals.css        # Global styles and Tailwind directives
├── components/            # React components
│   └── ResultsDisplay.tsx # Results visualization component
├── lib/                   # Utilities and helpers
│   ├── api.ts            # API client for backend communication
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
│   └── index.ts          # Shared types (mirrors backend models)
├── public/               # Static assets
├── .env.local            # Local environment variables (not committed)
├── .env.example          # Example environment variables
├── nixpacks.toml         # Railway build configuration
├── railway.json          # Railway deployment settings
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local to configure API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000
```

### Building

```bash
# Create production build
npm run build

# Run production server
npm start
```

### Linting

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file with:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# For Railway deployment, set to your backend service URL:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## Features

### Landing Page (`/`)
- Overview of TBONTB features
- How it works explanation
- CTA to start simulation

### Simulation Page (`/simulate`)
- Three scenario types:
  - **Buying**: Property purchase with mortgage
  - **Investment**: Stock market portfolio
  - **Compare**: Side-by-side comparison
- Dynamic form with validation
- Advanced settings (optional):
  - Number of simulations
  - Forecast parameters (mu, sigma)
  - Property/stock market parameters
- Real-time validation
- Loading states during simulation

### Results Display
- Interactive Plotly charts
- Summary statistics:
  - Median outcome
  - Pessimistic (10th percentile)
  - Optimistic (90th percentile)
  - IRR (Internal Rate of Return)
- Detailed breakdowns
- Comparison visualizations

## API Integration

The frontend communicates with the backend via REST API. See `lib/api.ts` for endpoint definitions.

### Endpoints Used

- `POST /api/v1/simulate/buying` - Run buying scenario
- `POST /api/v1/simulate/investment` - Run investment scenario
- `POST /api/v1/simulate/compare` - Compare scenarios
- `GET /api/v1/parameters/defaults` - Get default parameters
- `GET /api/health` - Health check

## Deployment to Railway

### Option 1: Automatic Detection

1. Push to GitHub
2. Create new Railway project from repo
3. Railway auto-detects Next.js
4. Set environment variables
5. Deploy!

### Option 2: Manual Configuration

Railway is configured via:

- `nixpacks.toml` - Build and start commands
- `railway.json` - Railway-specific settings
- `.railwayignore` - Files to exclude from deployment

### Environment Variables on Railway

Set these in your Railway service:

```
NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app
```

## Development Tips

### Hot Reload
Changes to files trigger automatic reload during development.

### Type Safety
All API responses are typed. See `types/index.ts` for definitions that mirror backend Pydantic models.

### Adding New Pages
Create files in `app/` directory following Next.js App Router conventions.

### Styling
- Uses TailwindCSS 4 with custom configuration
- Global styles in `app/globals.css`
- Component-level styles using Tailwind utility classes

### State Management
- Server state: Tanstack Query (for API calls)
- Client state: React hooks and Zustand (if needed)
- Form state: React Hook Form

## Troubleshooting

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Verify backend is running
3. Check browser console for CORS errors

### Production Build Issues
```bash
# Test production build locally
npm run build
npm start
```

## Performance

- Optimized with Next.js automatic code splitting
- Static generation where possible
- Dynamic imports for heavy components (Plotly)
- Image optimization via Next.js Image component

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding features:
1. Follow existing code structure
2. Add TypeScript types for new data
3. Use Tailwind for styling
4. Test locally before deploying

## Related Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Plotly.js Docs](https://plotly.com/javascript/)
- [React Hook Form Docs](https://react-hook-form.com/)
