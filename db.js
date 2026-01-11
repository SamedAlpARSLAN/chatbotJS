// db.js
const fs = require('fs').promises;
const path = require('path');

// Default local database used as a fallback
const defaultDatabase = [
  { id: 1, content: "Natural Language Processing is fun." },
  { id: 2, content: "Chatbots can answer questions." },
  { id: 3, content: "Machine learning is a key technology." }
];

/**
 * Loads the database from a local JSON file.
 * If the file cannot be read, returns the default database.
 *
 * @returns {Promise<Array>} An array of database records.
 */
async function loadDatabase() {
  try {
    const dbPath = path.join(__dirname, 'database.json');
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database.json, using default database:", error.message);
    return defaultDatabase;
  }
}

/**
 * Searches the database for records that include the query string.
 * The search is case-insensitive and returns a detailed response.
 *
 * @param {string} query - The search term provided by the user.
 * @returns {Promise<object>} An object containing the query, a custom message, and matching results.
 */
async function search(query) {
  if (typeof query !== 'string' || query.trim() === '') {
    throw new Error("A non-empty string query must be provided.");
  }
  
  const database = await loadDatabase();
  const results = database.filter(record =>
    record.content.toLowerCase().includes(query.toLowerCase())
  );
  
  if (results.length === 0) {
    return {
      query,
      message: "I couldn't find any records that match your query in the local database.",
      results: []
    };
  } else {
    return {
      query,
      message: `I found ${results.length} record(s) that match your query.`,
      results
    };
  }
}

module.exports = { search };
