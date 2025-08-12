# 🌱 Green Saudi - Setup Guide

## 🗄️ Database Setup

### Step 1: Create the Database Table

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `tgipeboxbnxfnzqdnepv`
3. Go to **SQL Editor**
4. Run this SQL command:

```sql
-- Drop existing tables if they exist
DROP TABLE IF EXISTS global_stats CASCADE;
DROP TABLE IF EXISTS trees CASCADE;
DROP TABLE IF EXISTS total_trees CASCADE;

-- Create the new simplified table
CREATE TABLE total_trees (
    id SERIAL PRIMARY KEY,
    count INTEGER DEFAULT 0
);

-- Insert initial record
INSERT INTO total_trees (id, count) VALUES (1, 0);

-- Verify the table was created
SELECT * FROM total_trees;
```

### Step 2: Verify Database Setup

After running the SQL, you should see:
```
id | count
---+-------
1  | 0
```

## 🚀 Server Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
node server.js
```

You should see:
```
Server running on port 3000
Supabase connected to: https://tgipeboxbnxfnzqdnepv.supabase.co
Available endpoints:
  GET  /api/total-trees - Get total trees planted
  POST /api/add-tree - Add one tree to counter
  GET  /api/health - Health check
Database initialization completed
```

## 🧪 Testing the System

### Test 1: Health Check
```bash
curl http://localhost:3000/api/health
```
Expected: `{"status":"OK","message":"Server is running"}`

### Test 2: Get Total Trees
```bash
curl http://localhost:3000/api/total-trees
```
Expected: `{"total_trees":0}`

### Test 3: Add a Tree
```bash
curl -X POST http://localhost:3000/api/add-tree
```
Expected: `{"total_trees":1}`

## 🎮 How It Works

### Frontend (Local Storage)
- User clicks are stored in `localStorage` as `userClicks`
- Every 50 clicks = 1 tree planted
- Trees are stored in `localStorage` as `userTrees`

### Backend (Database)
- Only tracks global total trees planted
- Simple table: `total_trees` with one row
- API endpoints:
  - `GET /api/total-trees` - Get global count
  - `POST /api/add-tree` - Increment global count by 1

### Garden System
- Reads from `localStorage` (`userTrees`)
- Automatically syncs when user plants trees
- Shows visual representation of planted trees

## 🔧 Files Structure

```
NewTreeProject/
├── server.js              # New simplified server
├── js/
│   ├── script.js          # Updated frontend logic
│   └── garden.js          # Updated garden system
├── css/
│   ├── style.css          # Main styles
│   └── garden.css         # Garden styles (updated)
├── index.html             # Home page
├── garden.html            # Garden page (header fixed)
└── setup-database.sql     # Database setup script
```

## ✅ What's Fixed

1. **Header**: Garden page now matches home page
2. **Garden Visibility**: Tree cells have lighter green background
3. **Database**: Simplified to just track total trees
4. **No More Click Resets**: Everything stored locally
5. **Simple API**: Only 2 endpoints needed

## 🎯 Usage

1. **Home Page**: Click button to plant trees (50 clicks = 1 tree)
2. **Garden Page**: See your planted trees visually
3. **Database**: Tracks global total across all users

The system is now much simpler and more reliable!
