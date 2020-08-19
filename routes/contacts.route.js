const { Router } = require('express');
const Contact = require('../models/Contact');

const router = Router();

router.get('/', async (req, res) => {
  const contacts = await Contact.find({});

  return res.json(contacts);
});

router.post('/', async (req, res) => {
  const { username, fullname, picture } = req.body;

  try {
    const contact = await new Contact({
      username, fullname, picture
    });

    contact.save();

    res.json(contact);
  } catch (e) {
    res.json(e)
  }
});

module.exports = router;
