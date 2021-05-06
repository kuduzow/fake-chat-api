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
        as: 'lastMessage',
      }
    },
    { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true} },
  ]);

  return res.json(contacts.map(contact => (
    {
      ...contact,
      online: Boolean(Math.random() < 0.5)
    }
    )));
});

module.exports = router;
