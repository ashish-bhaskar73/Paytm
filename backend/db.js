const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ashishbhaskar0123:paytm@cluster0.vsixnzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster07/paytm"
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowerCase: true,
    minLength: 3,
    maxLength: 20,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 25,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});
const Account = mongoose.model("Account", accountSchema);

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  Account,
};
