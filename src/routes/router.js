// routes/router.js
const express = require('express');
const pizzasRouter = require('../Pizzas/routes');
const ingredientsRouter = require('../Ingredients/routes');

const router = express.Router();

router.use('/pizzas', pizzasRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
