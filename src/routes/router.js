// routes/router.js
const express = require('express');
const pizzasRouter = require('../pizzas/PizzasRouter');
const ingredientsRouter = require('../ingredients/IngredientsRouters');

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
