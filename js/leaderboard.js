// Leaderboard JavaScript
class Leaderboard {
  constructor() {
    this.users = [];
    this.currentPeriod = 'all';
    this.init();
  }

  init() {
    this.generateMockData();
    this.setupEventListeners();
    this.renderLeaderboard();
    this.updateStats();
  }

  generateMockData() {
    // Generate mock users with Saudi Arabian names and locations
    const saudiNames = [
      'Ahmed Al-Rashid', 'Fatima Al-Zahra', 'Mohammed Al-Saud', 'Aisha Al-Qahtani',
      'Abdullah Al-Ghamdi', 'Noor Al-Harbi', 'Omar Al-Shamrani', 'Layla Al-Mutairi',
      'Khalid Al-Otaibi', 'Mariam Al-Dossary', 'Yousef Al-Qahtani', 'Hana Al-Shehri',
      'Ibrahim Al-Zahrani', 'Rania Al-Balawi', 'Hassan Al-Malki', 'Dana Al-Rashidi',
      'Ali Al-Harbi', 'Sara Al-Ghamdi', 'Waleed Al-Shamrani', 'Nada Al-Mutairi'
    ];

    const saudiCities = [
      'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Taif', 'Tabuk', 'Abha',
      'Jizan', 'Najran', 'Al-Ahsa', 'Al-Khobar', 'Dhahran', 'Yanbu', 'Al-Kharj'
    ];

    this.users = saudiNames.map((name, index) => ({
      id: index + 1,
      name: name,
      location: saudiCities[Math.floor(Math.random() * saudiCities.length)],
      treesPlanted: Math.floor(Math.random() * 500) + 10,
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) // Random date within last year
    }));

    // Add current user
    const currentUserTrees = this.getCurrentUserTrees();
    this.users.push({
      id: 'current',
      name: 'You',
      location: 'Saudi Arabia',
      treesPlanted: currentUserTrees,
      lastActive: new Date(),
      joinDate: new Date(),
      isCurrentUser: true
    });

    // Sort by trees planted
    this.users.sort((a, b) => b.treesPlanted - a.treesPlanted);
  }

  getCurrentUserTrees() {
    const stored = localStorage.getItem('globalClicks') || '0';
    const count = parseInt(stored);
    return Math.floor(count / 50);
  }

  setupEventListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentPeriod = e.target.dataset.period;
        this.renderLeaderboard();
      });
    });
  }

  renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    const filteredUsers = this.filterUsersByPeriod();
    
    list.innerHTML = '';

    filteredUsers.forEach((user, index) => {
      const entry = this.createLeaderboardEntry(user, index + 1);
      list.appendChild(entry);
    });
  }

  filterUsersByPeriod() {
    const now = new Date();
    let filteredUsers = [...this.users];

    if (this.currentPeriod === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredUsers = this.users.filter(user => user.lastActive >= monthAgo);
    } else if (this.currentPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredUsers = this.users.filter(user => user.lastActive >= weekAgo);
    }

    return filteredUsers.sort((a, b) => b.treesPlanted - a.treesPlanted);
  }

  createLeaderboardEntry(user, rank) {
    const entry = document.createElement('div');
    entry.className = 'leaderboard-entry';
    if (user.isCurrentUser) {
      entry.classList.add('current-user');
    }

    const rankClass = rank <= 3 ? `rank-${rank}` : '';
    
    entry.innerHTML = `
      <div class="rank ${rankClass}">${rank}</div>
      <div class="user-info">
        <div class="user-name">${user.name}</div>
        <div class="user-location">${user.location}</div>
      </div>
      <div class="user-stats">
        <div class="trees-planted">${user.treesPlanted}</div>
        <div class="impact-label">trees planted</div>
      </div>
    `;

    return entry;
  }

  updateStats() {
    const totalParticipants = document.getElementById('total-participants');
    const totalTreesPlanted = document.getElementById('total-trees-planted');
    const myRank = document.getElementById('my-rank');
    const myTrees = document.getElementById('my-trees');
    const myOxygen = document.getElementById('my-oxygen');
    const myCo2 = document.getElementById('my-co2');

    // Update global stats
    if (totalParticipants) {
      totalParticipants.textContent = this.users.length;
    }

    if (totalTreesPlanted) {
      const total = this.users.reduce((sum, user) => sum + user.treesPlanted, 0);
      totalTreesPlanted.textContent = total;
    }

    // Find current user rank
    const currentUser = this.users.find(user => user.isCurrentUser);
    if (currentUser && myRank) {
      const rank = this.users.findIndex(user => user.isCurrentUser) + 1;
      myRank.textContent = rank;
    }

    // Update my stats
    const currentUserTrees = this.getCurrentUserTrees();
    const oxygenPerTreePerDay = 0.118 * 365; // in kg
    const co2PerTreePerYear = 21.77; // in kg

    if (myTrees) myTrees.textContent = currentUserTrees;
    if (myOxygen) myOxygen.textContent = (currentUserTrees * oxygenPerTreePerDay).toFixed(2);
    if (myCo2) myCo2.textContent = (currentUserTrees * co2PerTreePerYear).toFixed(2);
  }

  refreshData() {
    // Update current user's tree count
    const currentUser = this.users.find(user => user.isCurrentUser);
    if (currentUser) {
      currentUser.treesPlanted = this.getCurrentUserTrees();
    }

    // Re-sort users
    this.users.sort((a, b) => b.treesPlanted - a.treesPlanted);
    
    this.renderLeaderboard();
    this.updateStats();
  }
}

// Initialize leaderboard when page loads
document.addEventListener('DOMContentLoaded', () => {
  const leaderboard = new Leaderboard();
  
  // Refresh data every 10 seconds
  setInterval(() => {
    leaderboard.refreshData();
  }, 10000);
});

// Export for global access
window.Leaderboard = Leaderboard; 