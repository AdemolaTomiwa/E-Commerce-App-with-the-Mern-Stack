const express = require('express');
const router = express.Router();

const Product = require('../../models/product');

// Get all products
// GET @api/products
// Public
router.get('/', (req, res) => {
   Product.find()
      .sort({ date: -1 })
      .then((product) => res.json({ product, success: true }))
      .catch((err) => console.log({ err, success: false }));
});

// Get a single product
// GET @api/products/:id
// Public
router.get('/:id', (req, res) => {
   Product.findById(req.params.id)
      .then((product) => res.json(product))
      .catch((err) => res.json({ message: 'No Product Found!' }));
});

// Create a product
// POST @api/products
// Private
router.post('/', (req, res) => {
   const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      image: req.body.image,
      category: req.body.category,
      countInStock: req.body.countInStock,
   });

   newProduct
      .save()
      .then((product) =>
         res
            .status(201)
            .json({ product, message: 'Product created successfully!' })
      );
});

// Delete a Product
// DELETE @api/products/:id
// Private
router.delete('/:id', (req, res) => {
   Product.findById(req.params.id)
      .then((product) =>
         product.remove().then(() =>
            res.json({
               message: 'Product Removed successfully!',
               success: true,
            })
         )
      )
      .catch((err) =>
         res.status(400).json({ success: false, message: 'An error occured' })
      );
});

module.exports = router;
