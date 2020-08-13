const { Router } = require('express');
const Message = require('../models/Message');
const mongoose = require('mongoose');

const router = Router();

router.get('/:myId/:contactId', async (req, res) => {
  const { contactId, myId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { toUserId: myId, fromUserId: contactId },
        { toUserId: contactId, fromUserId: myId }
      ]
    });

    return res.json(messages);

  } catch (error) {
    return res.json({error: error.message});
  }
});

router.post('/', async (req, res) => {
  const { myId, contactId, content, type } = req.body;

  console.log(req.body);

  try {
    const message = await new Message({
      content, type,
      toUserId: contactId,
      fromUserId: myId,
      time: new Date()
    });

    message.save();

    res.json(message);
  } catch (e) {
    res.json(e)
  }
});

module.exports = router;
