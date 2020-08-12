const { Router } = require('express');
const Message = require('../models/Message');

const router = Router();

router.get('/', async (req, res) => {
  const { contactId, myId } = req.body;

  const messages = await Message.find({
    $or: [
      { toUserId: myId, fromUserId: contactId },
      { toUserId: contactId, fromUserId: myId }
    ]
  });

  return res.json(messages);
});

router.post('/', async (req, res) => {
  const { myId, contactId, content, type } = req.body;

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
