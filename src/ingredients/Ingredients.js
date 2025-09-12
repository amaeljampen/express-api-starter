// entities/Ingredients.js
const db = require('./IngredientsDatabase');

class Ingredients {
    static create({ name }) {
        const sql = `INSERT INTO ingredients (name)
                     VALUES (?)`;
        const params = [name];
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                Ingredients.findById(this.lastID).then(resolve).catch(reject);
            });
        });
    }


    static findAll() {
        const sql = `SELECT * FROM ingredients ORDER BY id DESC`;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static findById(id) {
        const sql = `SELECT * FROM ingredients WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) return reject(err);
                resolve(row || null);
            });
        });
    }

    static update(id, { name }) {
        const sql = `
      UPDATE ingredients
      SET name = COALESCE(?, name),
      WHERE id = ?
    `;
        const params = [name, id];

        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) return reject(err);
                if (this.changes === 0) return resolve(null);
                Ingredients.findById(id).then(resolve).catch(reject);
            });
        });
    }

    static delete(id) {
        const sql = `DELETE FROM ingredients WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = Ingredients;
