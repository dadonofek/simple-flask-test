# Simple Flask Test - Railway Deployment

The **absolute simplest** working Flask app for Railway.

## Files
- `main.py` - Flask app with single route
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

## What Changed from Your Setup?
This version includes:
1. ✅ `nixpacks.toml` - tells Railway how to run the app
2. ✅ Proper PORT handling from environment variable
3. ✅ `host='0.0.0.0'` - allows external connections
4. ✅ Gunicorn for production serving

Common mistakes that cause "Application failed to respond":
- ❌ Missing nixpacks.toml or Procfile
- ❌ Not binding to 0.0.0.0
- ❌ Not reading PORT from environment
- ❌ Using Flask dev server instead of gunicorn
