const express = require("express");
const router = express.Router();

/* GET users listing. */
//отдает какой-то текст и пока на этом все, будем изменять
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
