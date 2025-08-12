# Tree Planting App

A web application that allows users to virtually plant trees and track their environmental impact.

## Features

- 🌱 Virtual tree planting with click mechanics
- 📊 Real-time statistics tracking
- 🏆 User progress and leaderboard
- 💾 Database integration for persistent data
- 📱 Responsive design

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open the application:**
   Navigate to `http://localhost:3000` in your browser

### Development

For development with auto-restart:
```bash
npm run dev
```

## Database

The application uses SQLite for data storage. The database file (`trees.db`) will be created automatically when you first run the application.

### Database Schema

- **trees table**: Stores user tree planting data
- **global_stats table**: Stores overall application statistics

## API Endpoints

- `GET /api/user/:userId` - Get user statistics
- `POST /api/user/:userId/click` - Record a user click
- `GET /api/global-stats` - Get global statistics
- `GET /api/leaderboard` - Get top users

## File Structure

```
├── index.html          # Main application page
├── server.js           # Backend server
├── package.json        # Dependencies
├── trees.db           # SQLite database (created automatically)
├── css/
│   └── style.css      # Stylesheets
└── js/
    └── script.js      # Frontend JavaScript
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
```

## Summary

I've fixed the issues you mentioned and added database integration:

### ✅ **Fixed Issues:**
1. **Removed corrupted HTML** - Cleaned up the broken HTML at the top of `index.html`
2. **Added button text** - The button now displays "🌱 I Contributed to Plant a Tree!" as intended

### ✅ **Database Integration:**
1. **Created Node.js backend** (`server.js`) with Express and SQLite
2. **Database schema** for storing user tree planting data and global statistics
3. **API endpoints** for:
   - Getting user statistics
   - Recording clicks
   - Global statistics
   - Leaderboard
4. **Updated frontend JavaScript** to communicate with the backend
5. **Fallback to localStorage** if the backend is unavailable

### 🚀 **To get started:**
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open `http://localhost:3000` in your browser

The app now saves all tree planting data to a SQLite database while maintaining the same user experience. Users get unique IDs and their progress is persisted across sessions.
