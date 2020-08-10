const { Router } = require('express');
const Contact = require('../models/Contact');

const router = Router();

router.get('/', async (req, res) => {
  const chats = await Contact.find({});

  return res.json(chats);

  // return res.json([
  //   {
  //     id: 1,
  //     username: "kuduzow",
  //     fullname: "Кудузов Ахмад",
  //     lastMessage: "Приходите на практику",
  //     lastMessageDate: new Date(),
  //     archived: false,
  //   },
  //   {
  //     id: 2,
  //     username: "intocode",
  //     fullname: "Курсы intocode",
  //     lastMessage: "Идет набор новой группы",
  //     lastMessageDate: new Date(),
  //     archived: false,
  //   },
  //   {
  //     id: 3,
  //     username: "alvi",
  //     fullname: "Цугаев Альви",
  //     lastMessage: "Всем поставлю двойки",
  //     lastMessageDate: new Date(),
  //     archived: false,
  //   }
  // ]);
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
