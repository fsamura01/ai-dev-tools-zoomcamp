const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../db.json');

const defaultData = {
  users: [],
  games: [],
  scores: [],
  leaderboard: [],
  watching: []
};

class Database {
  constructor() {
    this.data = { ...defaultData };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // Ensure all keys exist
        this.data = { ...defaultData, ...this.data };
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading database:', err);
      this.data = { ...defaultData };
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Generic helpers
  findAll(collection) {
    return this.data[collection] || [];
  }

  findById(collection, id) {
    const list = this.data[collection] || [];
    return list.find(item => item.id === id || item.userId === id);
  }

  insert(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    this.data[collection].push(item);
    this.save();
    return item;
  }
  
  update(collection, id, updates) {
    if (!this.data[collection]) return null;
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.data[collection][index] = { ...this.data[collection][index], ...updates };
    this.save();
    return this.data[collection][index];
  }

  remove(collection, id) {
      if (!this.data[collection]) return false;
      const initialLength = this.data[collection].length;
      this.data[collection] = this.data[collection].filter(item => item.id !== id);
      const isRemoved = this.data[collection].length < initialLength;
      if (isRemoved) this.save();
      return isRemoved;
  }
}

module.exports = new Database();
