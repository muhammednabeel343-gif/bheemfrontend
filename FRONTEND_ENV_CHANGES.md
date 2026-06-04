# Frontend: Remove Hardcoded URLs

## Changes Made

All hardcoded localhost URLs have been removed from the frontend. The application now **requires** `VITE_API_BASE_URL` environment variable to be set.

### Files Updated

#### Service Files (5 files)
1. ✅ `src/services/adminHardwareService.ts` - Removed `?? "http://127.0.0.1:8000"`
2. ✅ `src/services/authService.ts` - Removed `?? 'http://127.0.0.1:8000'`
3. ✅ `src/services/gameService.ts` - Removed `?? 'http://127.0.0.1:8000'`
4. ✅ `src/services/systemService.ts` - Removed `?? "http://127.0.0.1:8000"`
5. ✅ `src/services/favoriteService.ts` - Removed `?? 'http://127.0.0.1:8000'`

#### Context Files (1 file)
6. ✅ `src/contexts/AdminAuthContext.tsx` - Removed fallback URL

#### Admin Page Files (5 files)
7. ✅ `src/pages/admin/AdminDashboardPage.tsx` - Removed fallback URL
8. ✅ `src/pages/admin/CPUPage.tsx` - Removed all 3 fallback URLs
9. ✅ `src/pages/admin/GPUPage.tsx` - Removed all 3 fallback URLs
10. ✅ `src/pages/admin/RAMPage.tsx` - Removed all 3 fallback URLs
11. ✅ `.env.example` - Created with required variables

## Environment Configuration

### Before
```typescript
baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"
```

### After
```typescript
baseURL: import.meta.env.VITE_API_BASE_URL  // REQUIRED - must be set
```

## Required Setup

### Local Development (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```

### Production (Vercel)
Set in Vercel environment variables:
```
VITE_API_BASE_URL=https://your-railway-api.up.railway.app
```

## Testing Locally

```bash
# 1. Create .env file in frontend directory
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev

# 4. Backend must be running on http://localhost:8000
```

## Deployment to Vercel

1. Push changes to GitHub
2. Go to Vercel project settings
3. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-railway-backend-url.up.railway.app`
4. Redeploy the project

## Key Benefits

✅ No hardcoded localhost URLs  
✅ Works in any environment (local, staging, production)  
✅ Prevents accidental local URLs reaching production  
✅ Easier deployment configuration  
✅ Consistent with backend configuration approach  

## Troubleshooting

**Error: "Failed to fetch from undefined"**
- Make sure `.env` file exists in frontend directory
- Verify `VITE_API_BASE_URL` is set
- Check that backend is running and accessible

**Error: CORS error**
- Ensure backend `CORS_ORIGINS` includes the frontend URL
- For local dev: `http://localhost:5173`
- For production: Your Vercel domain

## Files Ready for Commit

```bash
git add .env.example
git add src/services/
git add src/contexts/
git add src/pages/admin/
git commit -m "Remove hardcoded localhost URLs - require VITE_API_BASE_URL environment variable"
git push origin main
```
