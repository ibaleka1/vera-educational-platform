# VERA Vercel Deployment Fix

## 🚨 Vercel Deployment Issues & Solutions

### Problem Analysis:
- Vercel is serving the basic `/index.html` instead of `/public/index.html`
- Voice chat integration not visible
- Multiple deployment failures

### Solution Steps:

## 1. Environment Variables Setup
Add these to your Vercel dashboard:
```
ELEVENLABS_API_KEY=sk_51628a528949b651d772e86834c487cdac3efedb89a80505
ELEVENLABS_VOICE_PRIMARY=uYXf8XasLslADfZ2MB4u
ELEVENLABS_VOICE_GENTLE=OYTbf65OHHFELVut7v2H
ELEVENLABS_VOICE_ENERGETIC=WAhoMTNdLdMoq1j3wf3I
```

## 2. File Structure Fix
- Move `/public/index.html` to root `/index.html`
- Update all asset paths
- Ensure voice chat is in main page

## 3. Deploy Commands
```bash
# Clear Vercel cache
vercel --prod --force

# Or redeploy
git add .
git commit -m "Fix deployment structure"
git push
vercel --prod
```

## 4. Test URLs
- Production: https://your-app.vercel.app
- Preview: Check Vercel dashboard for preview URLs

## Next Steps:
1. Fix file structure (automated below)
2. Update Vercel environment variables
3. Redeploy with force flag