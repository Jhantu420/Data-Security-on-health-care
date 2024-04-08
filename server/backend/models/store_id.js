const mongoose = require("mongoose");

const encryptedIdSchema = new mongoose.Schema({
  encryptedId: {
    type: String,
    required: true,
  },
});

const EncryptedId = mongoose.model("EncryptedId", encryptedIdSchema);

module.exports = EncryptedId;
