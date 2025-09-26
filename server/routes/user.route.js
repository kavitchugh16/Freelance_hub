
const express = require('express');
const { getUser, updateUser } = require('../controllers/user.controller.js');
const authenticate = require('../middlewares/authenticate.js');

const router = express.Router();

router.get('/:id', getUser);

router.patch('/:id', authenticate, updateUser);

module.exports = router;