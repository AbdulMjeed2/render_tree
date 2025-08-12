const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || 'https://tgipeboxbnxfnzqdnepv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaXBlYm94Ym54Zm56cWRuZXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTUxNTcsImV4cCI6MjA3MDU3MTE1N30.SNKVmQqrOzhVWjCVXISUMGj-bTm4M7p2MSXzB1Y9YGU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database - create a simple table for total trees
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Try to create the table using direct SQL (if you have access)
    // If not, we'll work with existing table or create manually
    const { data, error } = await supabase
      .from('total_trees')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('Table might not exist, creating initial record...');
      // Try to insert initial record
      const { error: insertError } = await supabase
        .from('total_trees')
        .insert([{ id: 1, count: 0 }]);
      
      if (insertError) {
        console.error('Error creating initial record:', insertError);
        console.log('Please create the table manually in Supabase with:');
        console.log('CREATE TABLE total_trees (id SERIAL PRIMARY KEY, count INTEGER DEFAULT 0);');
        console.log('INSERT INTO total_trees (id, count) VALUES (1, 0);');
      } else {
        console.log('Initial record created successfully');
      }
    } else {
      console.log('Database table exists and is accessible');
    }
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Initialize database on startup
initializeDatabase();

// API Routes

// Get total trees planted
app.get('/api/total-trees', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('total_trees')
      .select('count')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.error('Error getting total trees:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ total_trees: data?.count || 0 });
  } catch (error) {
    console.error('Error in /api/total-trees:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a tree (increment counter by 1)
app.post('/api/add-tree', async (req, res) => {
  try {
    // First get current count
    const { data: currentData, error: getError } = await supabase
      .from('total_trees')
      .select('count')
      .eq('id', 1)
      .single();
    
    if (getError) {
      console.error('Error getting current count:', getError);
      return res.status(500).json({ error: getError.message });
    }
    
    const currentCount = currentData?.count || 0;
    const newCount = currentCount + 1;
    
    // Update the count
    const { data: updatedData, error: updateError } = await supabase
      .from('total_trees')
      .update({ count: newCount })
      .eq('id', 1)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating count:', updateError);
      return res.status(500).json({ error: updateError.message });
    }
    
    console.log(`Tree added! Total trees: ${newCount}`);
    res.json({ total_trees: newCount });
  } catch (error) {
    console.error('Error in /api/add-tree:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Supabase connected to: ${supabaseUrl}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/total-trees - Get total trees planted');
  console.log('  POST /api/add-tree - Add one tree to counter');
  console.log('  GET  /api/health - Health check');
});
