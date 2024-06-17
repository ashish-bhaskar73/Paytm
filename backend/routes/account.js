const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");
const router = express.Router();

//user get balance detail
router.get("/balance", authMiddleware, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });
  res.json({
    balance: account.balance,
  });
});

//user able to transfer money to other account

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, to } = req.body;

  const account = await account
    .findOne({
      userId: req.userId,
    })
    .session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({ mesg: "insufficent balance" });
  }

  //checking account in which you want to transfer
  const toAccount = await Account.findOne({
    userId: to,
  }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({ mesg: "Invalid account" });
  }

  //perform transaction
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  //commit the transaction
  await session.commitTransaction();
  res.status(200).json({ mesg: "transfer successfully" });
});

module.exports = router;
