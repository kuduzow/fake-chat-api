const { Router } = require('express');
const Contact = require('../models/Contact');
const Message = require('../models/Message');

const router = Router();

router.get('/', async (req, res) => {
  const contacts = await Contact.aggregate([
    {
      $lookup: {
        from: Message.collection.name,
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $eq: ['$fromUserId', '$$id'] },
                  { $eq: ['$toUserId', '$$id'] }
                ]
              }
            }
          },
          { $sort: { time: -1 } },
          { $limit: 1 }
        ],
        as: 'lastMessage'
      }
    },
    { $unwind: '$lastMessage' }
  ]);

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
