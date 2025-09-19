const db = require('./PizzasDatabase');

class PizzaIngredient {
    static create({ pizzaId, ingredientId }) {
        const sql = `INSERT INTO pizza_ingredients (pizzaId, ingredientId) VALUES (?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId, ingredientId], function (err) {
                if (err) return reject(err);
                resolve({ pizzaId, ingredientId });
            });
        });
    }

    static findByPizzaId(pizzaId) {
        const sql = `SELECT ingredientId FROM pizza_ingredients WHERE pizzaId = ?`;
        // exécute la requete SQL dans une promise (pour les retours). Si erreur, rejet de la promise.
        // Sinon resoud avec un tableau des IDs d'ingredients
        return new Promise((resolve, reject) => {
            db.all(sql, [pizzaId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows.map(row => row.ingredientId));
            });
        });
    }

    static deleteByPizzaId(pizzaId) {
        const sql = `DELETE FROM pizza_ingredients WHERE pizzaId = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [pizzaId], function (err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
}

module.exports = PizzaIngredient;