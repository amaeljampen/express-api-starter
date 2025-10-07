// routes/router.js
const express = require('express');
const pizzasRouter = require('../../../ms-pizzas/src/PizzasRouter');
const ingredientsRouter = require('../IngredientsRouters');

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
