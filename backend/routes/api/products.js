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
      .catch((err) => res.status(400));
});

// Get a single product
// GET @api/products/:id
// Public
router.get('/:id', (req, res) => {
   Product.findById(req.params.id)
      .then((product) => res.json(product))
      .catch((err) => res.json({ message: 'No Product Found!' }));
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

// Create a product
// POST @api/products
// Private
router.post('/', (req, res) => {
   const newProduct = new Product({
      name: 'Sample Name',
      description: 'Sample Description',
      price: 0,
      brand: 'Sample Brand',
      image: '/images/sample.jpg',
      category: 'Sample Category',
      countInStock: 0,
   });

   newProduct
      .save()
      .then((product) =>
         res
            .status(201)
            .json({ product, message: 'Product created successfully!' })
      );
});

// Update a product
// PUT @api/products/:id
// Private
router.put('/:id', (req, res) => {
   Product.findById(req.params.id)
      .then((product) => {
         if (product) {
            product.name = req.body.name;
            product.price = req.body.price;
            product.description = req.body.description;
            product.image = req.body.image;
            product.brand = req.body.brand;
            product.category = req.body.category;
            product.countInStock = req.body.countInStock;

            product.save().then(res.status(201).json({ product }));
         } else {
            res.status(501).json({ message: 'Product Not Found' });
         }
      })
      .catch((err) => console.log(err));
});

module.exports = router;
