const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const { generateToken } = require('../../utils');

const router = express.Router();

dotenv.config();

const User = require('../../models/user');

router.post('/', (req, res) => {
   const { name, email, password, isAdmin } = req.body;

   if (!name) {
      res.status(400).json({ message: 'Please enter name' });
   } else if (!email) {
      res.status(400).json({ message: 'Please enter email' });
   } else if (!password) {
      res.status(400).json({ message: 'Please enter password' });
   } else if (password.length <= 5) {
      res.status(400).json({
         message: 'Password should be at least 6 character',
      });
   } else {
      // Check for existing user
      User.findOne({ email })
         .then((user) => {
            if (user) {
               return res.status(400).json({ message: 'User already exist' });
            }

            const newUser = new User({
               name,
               email,
               password,
               isAdmin,
            });

            //  Create a salt
            bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;

                  newUser.password = hash;

                  newUser.save().then((user) =>
                     res.json({
                        token: generateToken(user),
                        user: {
                           id: user.id,
                           name: user.name,
                           email: user.email,
                           isAdmin: user.isAdmin,
                        },
                     })
                  );
               });
            });
         })
         .catch((err) => console.log(err));
   }
});

// Get all users
// GET @api/users
// Private
router.get('/', (req, res) => {
   User.find()
      .sort({ date: -1 })
      .select('-password')
      .then((user) => res.status(200).json(user))
      .catch((err) => res.status(400));
});

// Get a single user
// GET @api/users/:id
// Private
router.get('/:id', (req, res) => {
   User.findById(req.params.id)
      .select('-password')
      .then((user) => res.json(user))
      .catch((err) => res.json({ message: 'No User Found!' }));
});

// Update a User
// PUT @api/user/:id
// Private
router.put('/:id', (req, res) => {
   User.findById(req.params.id)
      .then((user) => {
         if (user) {
            user.name = req.body.name;
            user.email = req.body.email;
            user.description = req.body.description;
            user.isAdmin = req.body.isAdmin;

            user.save().then(res.status(201).json({ user }));
         } else {
            res.status(501).json({ message: 'User Not Found' });
         }
      })
      .catch((err) => console.log(err));
});

// Delete a Product
// DELETE @api/products/:id
// Private
router.delete('/:id', (req, res) => {
   User.findById(req.params.id)
      .then((user) =>
         user.remove().then(() =>
            res.json({
               message: 'user Removed successfully!',
               success: true,
            })
         )
      )
      .catch((err) =>
         res.status(400).json({ success: false, message: 'An error occured' })
      );
});
module.exports = router;
