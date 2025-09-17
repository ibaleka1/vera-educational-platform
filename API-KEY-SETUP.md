# 🔑 ElevenLabs API Key Setup Guide

## Method 1: Environment File (Recommended)

### Step 1: Copy the environment template
```bash
cp .env.example .env
```

### Step 2: Edit the .env file
Open `.env` and replace `your_elevenlabs_api_key_here` with your actual API key:
```bash
ELEVENLABS_API_KEY=sk-your-actual-api-key-here
```

## Method 2: Direct Code Update (Quick Testing)

### For Voice Service
Edit `lib/vera-voice-service.js` around line 6:

```javascript
constructor() {
  this.apiKey = 'sk-your-actual-api-key-here'; // Replace this line
  this.baseUrl = 'https://api.elevenlabs.io/v1';
  // ... rest of constructor
}
```

### For API Endpoint  
Edit `api/vera-voice.js` around line 4:

```javascript
const ELEVENLABS_API_KEY = 'sk-your-actual-api-key-here'; // Replace this line
```

## Method 3: PowerShell Environment Variable

```powershell
# Set for current session
$env:ELEVENLABS_API_KEY = "sk-your-actual-api-key-here"

# Set permanently (requires restart)
[Environment]::SetEnvironmentVariable("ELEVENLABS_API_KEY", "sk-your-actual-api-key-here", "User")
```

## 🔍 Where to Find Your API Key

1. Go to [ElevenLabs.io](https://elevenlabs.io)
2. Sign up/Log in to your account
3. Navigate to your Profile Settings
4. Go to the "API Keys" section
5. Generate a new API key or copy existing one
6. It will look like: `sk-1a2b3c4d5e6f7g8h9i0j...`

## 🧪 Test Your Setup

After adding your API key, test it with:

1. Open `voice-test.html` in your browser
2. Click "Test Primary Voice" 
3. Check browser console for any API errors
4. If successful, you'll see voice generation working

## 🚨 Security Notes

- ⚠️ **Never commit .env files to git**
- ✅ The `.env` file is already in `.gitignore`
- ✅ Use environment variables in production
- ❌ Don't hardcode API keys in source code for production

## 📁 File Locations Summary

- **Environment Template:** `.env.example` 
- **Your Environment File:** `.env` (create this)
- **Voice Service:** `lib/vera-voice-service.js`
- **API Endpoint:** `api/vera-voice.js`
- **Frontend Integration:** `public/js/landing.js`

Choose Method 1 (environment file) for the cleanest, most secure setup!