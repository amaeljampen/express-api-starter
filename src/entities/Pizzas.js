// entities/Pizzas.js
const db = require('../config/database');

class Pizzas {
    static create({ name, imageUrl, price }) {
        const sql = `INSERT INTO pizzas (name, price, imageUrl)
                     VALUES (?, ?, ?)`;
        const params = [name || null, price, imageUrl || null];
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                Pizzas.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }


    static findAll() {
        const sql = `SELECT * FROM pizzas ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static findById(id) {
        const sql = `SELECT * FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    static update(id, { name, imageUrl, price }) {
        const sql = `
      UPDATE pizzas
      SET name = COALESCE(?, name),
          imageUrl = COALESCE(?, imageUrl),
          price = COALESCE(?, price)
      WHERE id = ?
    `;
        const params = [name, imageUrl, price, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Pizzas.findById(id).then(resolve).catch(reject);
            });
        });
    }

    static delete(id) {
        const sql = `DELETE FROM pizzas WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Pizzas;
