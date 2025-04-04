const mongoose = require("mongoose");
const LogSchema = require("./LogSchema");

const LogModel = mongoose.Schema(LogSchema);

LogModel.statics.addLog = function (logContent) {
  let data = this.create({ ...logContent });
  return data;
};

// method on doc itself
LogModel.statics.getEmailsSent = function (user, email) {
  let data = this.find({
    user: user,
    type: "email-sent",
    "meta.to": email,
  }).sort({ createdAt: -1 });
  return data;
};

LogModel.statics.getLastEmailSent = function (user, email) {
  let data = this.find({
    user: user,
    type: "email-sent",
    "meta.to": email,
  })
    .sort({ createdAt: -1 })
    .limit(1);
  return data;
};

LogModel.statics.addEmailSent = function (user, meta) {
  let data = this.create({ user: user, type: "email-sent", meta: meta });
  return data;
};

module.exports = mongoose.model("log", LogModel);
