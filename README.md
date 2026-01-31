# Simple Calculator - Railway Deployment

A simple Flask calculator app for Railway - step 1 in building up to TBONTB.

## Features
- Frontend form for user input (two numbers)
- Backend adds the numbers and returns the result
- Minimal dependencies, easy to deploy

## Files
- `main.py` - Flask app with calculator routes and HTML templates
- `requirements.txt` - Python dependencies (Flask + gunicorn)
- `nixpacks.toml` - Railway build configuration

## Deploy to Railway

### Method 1: One-Click Template (Easiest!)
1. Go to https://railway.app/template/igzwwg
2. Click "Deploy Now"
3. Done! ✅

### Method 2: From GitHub
1. Push these files to a GitHub repo
2. Go to https://railway.app
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Railway auto-detects and deploys
6. Click "Generate Domain" to get your URL

### Method 3: Railway CLI
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

## Test Locally
```bash
pip install -r requirements.txt
python main.py
# Visit http://localhost:5000
```

## How It Works
- Railway reads `nixpacks.toml` to know how to start the app
- The `$PORT` variable is automatically provided by Railway
- Gunicorn runs the Flask app in production mode
- That's it!

## How It Works
1. User visits the home page and sees a form with two number inputs
2. User enters two numbers and clicks "Calculate"
3. Backend receives the numbers via POST request
4. Backend adds them and returns the result page

## Next Steps (TBONTB migration)
This is step 1 of gradually adding backend functionality:
- [x] Step 1: Simple adder (FE + minimal BE)
- [ ] Step 2: Add more complex backend logic
- [ ] Step 3: Add database connectivity
- [ ] Step 4: Migrate TBONTB features one by one
