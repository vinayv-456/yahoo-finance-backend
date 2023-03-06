const express = require("express");
const router = express.Router();

// router.use("/", require("./routes/home"));
router.use(require("./routes/home"));

module.exports = router;
