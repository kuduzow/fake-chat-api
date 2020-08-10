const { Router } = require('express');
const Contact = require('../models/Contact');

const router = Router();

router.get('/', async (req, res) => {
  //const chats = await Contact.find({});
  //console.log(chats)
  //
  // return res.json(...chats);

  return res.json([
    {
      id: 1,
      username: "kuduzow",
      fullname: "Кудузов Ахмад",
      lastMessage: "Приходите на практику",
      lastMessageTimestamp: 1597061417,
      archived: false,
    },
    {
      id: 2,
      username: "intocode",
      fullname: "Курсы intocode",
      lastMessage: "Идет набор новой группы",
      lastMessageTimestamp: 1597061217,
      archived: false,
    },
    {
      id: 3,
      username: "alvi",
      fullname: "Цугаев Альви",
      lastMessage: "Всем поставлю двойки",
      lastMessageTimestamp: 1597051217,
      archived: false,
    }
  ]);
});

module.exports = router;
