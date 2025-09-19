// controllers/IngredientsController.js
const { validationResult } = require('express-validator');
const Pizza = require('./Pizzas');
const axios = require("axios");
const PizzaIngredient = require("./PizzaIngredients");

require('dotenv').config();
const port = process.env.PORT || 3000;

/**
 * Controller functions use Express (req, res) signatures and
 * respond with status codes matching MDN/HTTP recommendations.
 */

exports.create = async (req, res, next) => {
    try {
        // Validation des inputs
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, imageUrl, price, ingredients } = req.body;

        if (!Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ message: "Must have at least one ingredient" });
        }

        // Vérifier chaque ingrédient via GET /ingredients/:id
        const missing = [];
        for (const id of ingredients) {
            try {
                await axios.get(`http://localhost:${port}/api/ingredients/${id}`);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    missing.push(id);
                } else {
                    // Si erreur réseau ou autre → stop
                    return res.status(500).json({ message: "Error occurred" });
                }
            }
        }

        if (missing.length > 0) {
            return res.status(400).json({
                message: "Some ingredients doesn\'t exist.",
                missing
            });
        }

        // Créer la pizza
        const createdPizza = await Pizza.create({ name, imageUrl, price });

        // Créer les associations pizza → ingrédients
        for (const ingredientId of ingredients) {
            await PizzaIngredient.create({
                pizzaId: createdPizza.id,
                ingredientId,
            });
        }

        // Répondre avec la pizza + ingrédients
        return res.status(201).json({
            ...createdPizza,
            ingredients,
        });

    } catch (err) {
        console.error("Error creating pizza:", err.message);
        next(err);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const pizzas = await Pizza.findAll();
        // 200 OK
        return res.status(200).json(pizzas);
    } catch (err) {
        next(err);
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid Pizza id' });

        const pizza = await Pizza.findById(id);
        if (!pizza) return res.status(404).json({ error: 'Pizza not found' }); // 404 Not Found

        return res.status(200).json(pizza);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        // validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid Pizza id' });

        const { name, imageUrl, price } = req.body;
        const updated = await Pizza.update(id, { name, imageUrl, price });
        if (!updated) return res.status(404).json({ error: 'Pizza not found' }); // 404 Not Found

        return res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid Pizza id' });

        const deleted = await Pizza.delete(id);
        if (deleted === 0) return res.status(404).json({ error: 'Pizza not found' });

        // 204 No Content on successful delete
        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};
