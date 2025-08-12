// Virtual Garden JavaScript
class VirtualGarden {
  constructor() {
    this.gridSize = 8;
    this.trees = [];
    this.saudiTreeSpecies = [
      { emoji: '🌴', name: 'Date Palm', rarity: 0.4 },
      { emoji: '🌿', name: 'Acacia', rarity: 0.3 },
      { emoji: '🌳', name: 'Ghaf Tree', rarity: 0.2 },
      { emoji: '🌲', name: 'Juniper', rarity: 0.1 }
    ];
    
    this.init();
  }

  init() {
    this.loadGarden();
    this.createGrid();
    this.updateStats();
    this.syncWithMainSystem();
    this.loadGlobalStats();
  }

  createGrid() {
    console.log('Creating grid...');
    console.log('Current trees:', this.trees);
    const grid = document.getElementById('garden-grid');
    if (!grid) {
      console.error('Garden grid element not found!');
      return;
    }
    grid.innerHTML = '';

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const cell = document.createElement('div');
      cell.className = 'garden-cell empty';
      cell.dataset.index = i;
      
      const tree = this.trees.find(t => t.position === i);
      if (tree) {
        console.log(`Found tree at position ${i}:`, tree);
        this.renderTree(cell, tree);
      }
      
      grid.appendChild(cell);
    }
    console.log('Grid created with', this.trees.length, 'trees');
  }

  renderTree(cell, tree) {
    console.log('Rendering tree:', tree);
    cell.className = `garden-cell tree-3d tree-${tree.stage}`;
    cell.innerHTML = tree.emoji;
    cell.title = `${tree.name} - ${tree.stage}`;
    
    console.log('Cell after rendering:', cell.outerHTML);
  }

  addTree() {
    console.log('Adding tree...');
    if (this.trees.length >= this.gridSize * this.gridSize) {
      alert('Your garden is full! Plant more trees to expand.');
      return;
    }

    // Find random empty position
    let position;
    do {
      position = Math.floor(Math.random() * (this.gridSize * this.gridSize));
    } while (this.trees.find(t => t.position === position));

    // Select random tree species based on rarity
    const random = Math.random();
    let selectedSpecies;
    let cumulativeRarity = 0;
    
    for (const species of this.saudiTreeSpecies) {
      cumulativeRarity += species.rarity;
      if (random <= cumulativeRarity) {
        selectedSpecies = species;
        break;
      }
    }

    const newTree = {
      id: Date.now(),
      emoji: selectedSpecies.emoji,
      name: selectedSpecies.name,
      position: position,
      stage: 'seed',
      plantedAt: Date.now(),
      lastGrowth: Date.now()
    };

    console.log('New tree:', newTree);
    this.trees.push(newTree);
    this.saveGarden();
    this.createGrid();
    this.updateStats();
    
    // Show growth animation
    this.animateTreeGrowth(newTree);
  }

  animateTreeGrowth(tree) {
    const cell = document.querySelector(`[data-index="${tree.position}"]`);
    if (cell) {
      cell.style.animation = 'treeGrow 0.5s ease-out';
      setTimeout(() => {
        cell.style.animation = '';
      }, 500);
    }
  }

  growTrees() {
    const now = Date.now();
    const growthInterval = 24 * 60 * 60 * 1000; // 24 hours

    this.trees.forEach(tree => {
      if (now - tree.lastGrowth > growthInterval) {
        if (tree.stage === 'seed') {
          tree.stage = 'sapling';
        } else if (tree.stage === 'sapling') {
          tree.stage = 'mature';
        }
        tree.lastGrowth = now;
      }
    });

    this.saveGarden();
    this.createGrid();
  }

  updateStats() {
    const gardenTrees = document.getElementById('garden-trees');
    const totalPlanted = document.getElementById('total-planted');
    
    if (gardenTrees) gardenTrees.textContent = this.trees.length;
    if (totalPlanted) {
      // Get total planted from localStorage
      const userTrees = parseInt(localStorage.getItem("userTrees") || "0");
      totalPlanted.textContent = userTrees;
    }
  }

  async loadGlobalStats() {
    try {
      const response = await fetch(`${API_BASE}/total-trees`);
      if (response.ok) {
        const data = await response.json();
        const totalTrees = data.total_trees || 0;
        
        // Update the total planted display with global count
        const totalPlanted = document.getElementById('total-planted');
        if (totalPlanted) {
          totalPlanted.textContent = totalTrees;
        }
        
        console.log(`Updated garden with global stats: ${totalTrees} trees planted`);
      }
    } catch (error) {
      console.error('Error loading global stats in garden:', error);
    }
  }

  async syncGardenWithLocalStorage() {
    try {
      const userTrees = parseInt(localStorage.getItem("userTrees") || "0");
      const currentGardenTrees = this.trees.length;
      
      console.log(`LocalStorage trees: ${userTrees}, Garden trees: ${currentGardenTrees}`);
      
      // If localStorage has more trees than garden, add missing trees
      if (userTrees > currentGardenTrees) {
        const treesToAdd = userTrees - currentGardenTrees;
        console.log(`Adding ${treesToAdd} trees to garden from localStorage`);
        for (let i = 0; i < treesToAdd; i++) {
          this.addTree();
        }
      }
    } catch (error) {
      console.error('Error syncing garden with localStorage:', error);
    }
  }

  async syncWithMainSystem() {
    try {
      await this.syncGardenWithLocalStorage();
    } catch (error) {
      console.error('Error syncing with main system:', error);
    }
  }

  saveGarden() {
    // Save garden data to localStorage only
    localStorage.setItem('virtualGarden', JSON.stringify(this.trees));
  }

  loadGarden() {
    // Load garden data from localStorage only
    const saved = localStorage.getItem('virtualGarden');
    if (saved) {
      this.trees = JSON.parse(saved);
    }
  }
}

// Global garden instance
let gardenInstance;

// API base URL - automatically detect environment
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// Initialize garden when page loads
document.addEventListener('DOMContentLoaded', () => {
  gardenInstance = new VirtualGarden();
  
  // Grow trees every hour
  setInterval(() => {
    gardenInstance.growTrees();
  }, 60 * 60 * 1000);
  
  // Sync with main system every 5 seconds
  setInterval(() => {
    gardenInstance.syncWithMainSystem();
    gardenInstance.updateStats();
    gardenInstance.loadGlobalStats();
  }, 5000);
});

// Add tree manually for testing (remove in production)
window.addTestTree = function() {
  if (gardenInstance) {
    gardenInstance.addTree();
  }
}; 