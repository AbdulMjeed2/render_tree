// Track user clicks locally
let userClicks = parseInt(localStorage.getItem("userClicks") || "0");
let userTrees = parseInt(localStorage.getItem("userTrees") || "0");

const treeDisplay = document.getElementById("tree-count");
const treeDisplayAlt = document.getElementById("tree-count-display");
const oxygenDisplay = document.getElementById("oxygen");
const co2Display = document.getElementById("co2");
const clicksRemainingDisplay = document.getElementById("clicks-remaining");
const button = document.getElementById("click-button");

// API base URL - automatically detect environment
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

function updateStats() {
  const oxygenPerTreePerDay = 0.118 * 365; // in kg
  const co2PerTreePerYear = 21.77; // in kg
  const clicksRemaining = 50 - (userClicks % 50);

  if (treeDisplay) treeDisplay.textContent = userTrees;
  if (clicksRemainingDisplay) clicksRemainingDisplay.textContent = clicksRemaining;
}

async function addClick() {
  try {
    // Disable button temporarily to prevent rapid clicks
  //  if (button) button.disabled = true;
    
    // Increment user clicks
    userClicks++;
    localStorage.setItem("userClicks", userClicks.toString());
    
    // Check if we should add a tree (every 50 clicks)
    const newTrees = Math.floor(userClicks / 50);
    if (newTrees > userTrees) {
      userTrees = newTrees;
      localStorage.setItem("userTrees", userTrees.toString());
      
      // Add tree to global database
      try {
        const response = await fetch(`${API_BASE}/add-tree`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Tree planted! Global total: ${data.total_trees}`);
          // Immediately update global stats after planting a tree
        } else {
          console.error('Failed to add tree to database');
        }
      } catch (error) {
        console.error('Error adding tree to database:', error);
      }
    }
    
    updateStats();
    
    // Add visual feedback
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.disabled = false;
      }, 100);
    }
    
  } catch (error) {
    console.error('Error adding click:', error);
    // Re-enable button
    if (button) {
      setTimeout(() => {
        button.disabled = false;
      }, 100);
    }
  }
}

// Load global stats from database
async function loadGlobalStats() {
  try {
    const response = await fetch(`${API_BASE}/total-trees`);
    if (response.ok) {
      const data = await response.json();
      const totalTrees = data.total_trees || 0;
      
      // Update Collective Impact section
      if (treeDisplayAlt) {
        treeDisplayAlt.textContent = totalTrees;
      }
      
      // Calculate and update oxygen and CO2 based on total trees
      const oxygenPerTreePerYear = 118; // in kg
      const co2PerTreePerYear = 22; // in kg
      
              if (oxygenDisplay) {
          oxygenDisplay.textContent = (totalTrees * oxygenPerTreePerYear).toFixed(2);
        }
      
      if (co2Display) {
        co2Display.textContent = (totalTrees * co2PerTreePerYear).toFixed(2);
      }
      
      console.log(`Updated global stats: ${totalTrees} trees planted`);
    }
  } catch (error) {
    console.error('Error loading global stats:', error);
  }
}

// Initialize when page loads
window.addEventListener("DOMContentLoaded", () => {
  updateStats();
  loadGlobalStats();
  
  // Add click event listener to button
  if (button) {
    button.addEventListener("click", addClick);
  }
  
  // Update global stats every 5 seconds to keep it current
  setInterval(() => {
    loadGlobalStats();
  }, 50);
});
