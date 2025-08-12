# Vercel Deployment Troubleshooting Guide

## 404 Error After Deployment

If you're getting a 404 error after deploying to Vercel, follow these steps:

### 1. Check Database Setup

First, make sure your Supabase database has the required table:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run this SQL script:

```sql
-- Create the total_trees table if it doesn't exist
CREATE TABLE IF NOT EXISTS total_trees (
  id SERIAL PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Insert initial record if it doesn't exist
INSERT INTO total_trees (id, count) 
VALUES (1, 0) 
ON CONFLICT (id) DO NOTHING;
```

### 2. Verify Environment Variables

In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Make sure these are set:
   - `SUPABASE_URL`: `https://tgipeboxbnxfnzqdnepv.supabase.co`
   - `SUPABASE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaXBlYm94Ym54Zm56cWRuZXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTUxNTcsImV4cCI6MjA3MDU3MTE1N30.SNKVmQqrOzhVWjCVXISUMGj-bTm4M7p2MSXzB1Y9YGU`

### 3. Test API Endpoints

After deployment, test these endpoints:

1. **Health Check**: `https://your-vercel-url.vercel.app/api/health`
2. **Get Total Trees**: `https://your-vercel-url.vercel.app/api/total-trees`
3. **Add Tree**: `https://your-vercel-url.vercel.app/api/add-tree` (POST)

### 4. Check Vercel Logs

1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Functions" tab
4. Check the logs for any errors

### 5. Redeploy

If the issue persists:

1. Make a small change to any file (like adding a comment)
2. Commit and push to GitHub
3. Vercel will automatically redeploy

### 6. Common Issues

**Issue**: API calls returning 404
**Solution**: The JavaScript files now automatically detect the environment and use the correct API URL

**Issue**: Database connection errors
**Solution**: Verify your Supabase credentials and table structure

**Issue**: Static files not loading
**Solution**: Make sure all HTML, CSS, and JS files are in the root directory

### 7. Test Locally First

Before deploying, test locally:

```bash
npm install
node server.js
```

Then visit `http://localhost:3000` and test the functionality.

### 8. Contact Support

If none of the above works, check:
- Vercel deployment logs
- Browser console for JavaScript errors
- Network tab for failed API requests

The application should now work correctly on Vercel with the updated API URL detection.
