const { Router } = require('express');

/* MAIN ROUTER */
const router = Router();

router.use('/profile', require('./profile.route'));

router.use('/contacts', require('./contacts.route'))

module.exports = router;
