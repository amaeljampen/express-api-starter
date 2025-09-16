// config/PizzasDatabase.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'dev.sqlite');

const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Could not connect to sqlite', err);
        process.exit(1);
    }
    console.log('Connected to sqlite database:', dbFile);
});

// Initialize products table if not exists
const initSql = `
CREATE TABLE IF NOT EXISTS pizzas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  imageUrl TEXT,
  price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS pizza_ingredients (
    pizzaId INTEGER NOT NULL,
    ingredientId INTEGER NOT NULL,
    FOREIGN KEY (pizzaId) REFERENCES pizzas(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredientId) REFERENCES ingredients(id) ON DELETE CASCADE
    );
`

db.serialize(() => {
    db.run(initSql, (err) => {
        if (err) {
            console.error('Failed to initialize database', err);
            process.exit(1);
        }
    });
});

module.exports = db;
