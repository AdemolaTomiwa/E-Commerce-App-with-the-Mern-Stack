const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const { generateToken } = require('../../utils');

const User = require('../../models/user');

router.post('/', (req, res) => {
   const { email, password } = req.body;

   if (!email) {
      res.status(400).json({ message: 'Please enter email' });
   } else if (!password) {
      res.status(400).json({ message: 'Please enter password' });
   } else {
      // Check if user exits
      User.findOne({ email })
         .then((user) => {
            if (!user) {
               return res.status(400).json({ message: 'User does not exist' });
            }

            // Validate Password
            bcrypt
               .compare(password, user.password)
               .then((isMatch) => {
                  if (!isMatch) {
                     return res
                        .status(400)
                        .json({ message: 'Invalid credentials' });
                  }

                  // Password checks
                  res.json({
                     token: generateToken(user),
                     user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        isAdmin: user.isAdmin,
                     },
                  });
               })
               .catch((err) =>
                  res
                     .status(400)
                     .json({ message: 'An error occured! Please try again' })
               );
         })
         .catch((err) =>
            res
               .status(400)
               .json({ message: 'An error occured! Please try again' })
         );
   }
});

module.exports = router;
