const { Router } = require("express");
const Message = require("../models/Message");
const mongoose = require("mongoose");
const { haveManySecondsHavePassed } = require("../utils/time");

const router = Router();

router.get("/:myId/:contactId", async (req, res) => {
  const { contactId, myId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { toUserId: myId, fromUserId: contactId },
        { toUserId: contactId, fromUserId: myId },
      ],
    });

    return res.json(messages);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  const { myId, contactId, content, type } = req.body;

  // т.к. это фейковый бекенд с минимальным функционалом, то myId
  // может быть только 5f2ea3801f986a01cefc8bcd
  if (myId !== "5f2ea3801f986a01cefc8bcd") {
    return res
      .status(400)
      .json("В качестве myId может быть только 5f2ea3801f986a01cefc8bcd");
  }

  if (!contactId || !mongoose.isValidObjectId(contactId)) {
    return res.status(400).json("Проверь правильность поля contactId");
  }

  if (!content) {
    return res.status(400).json("Поле content пришло пустым");
  }

  if (type !== "text") {
    return res
      .status(400)
      .json("Для поля 'type' доступно только значение 'text'");
  }

  const lastMessageCreatedTime = await Message.findOne(
    {},
    { time: true }
  ).sort({ _id: -1 });

  if (haveManySecondsHavePassed(lastMessageCreatedTime.time) < 15) {
    return res
      .status(400)
      .json("В течении 15-ти секунд можно добавлять только одно сообщение");
  }

  try {
    const message = await new Message({
      content,
      type,
      toUserId: contactId,
      fromUserId: myId,
      time: new Date(),
    });

    message.save();

    res.json(message);
  } catch (e) {
    res.json(e);
  }
});

router.delete("/:id", async (req, res) => {
  return res.json({
    status: "ok",
    message: `Сообщение с id ${req.params.id} удалено`,
    description:
      "Внимание! Данная операция не удалила сообщение полностью с " +
      "сервера, а только имитировала удаление. После обновления " +
      "удаленное сообщение вновь станет доступным в чате.",
  });
});
module.exports = router;
