const express = require("express");
const router = express.Router();
const { articles } = require("../data/data.json"); //подключаем шаблон для blog
const fs = require("fs/promises");
const path = require("path");

/* GET home page. */
//отдать шаблон, отрендерить, в который пробромить какую-либо переменную и заэкспортировать наш router
//Routing для  index.html
router.get("/", (req, res, next) => {
  res.render("index", { title: "About me" }); //то что будет отображаться при запуске сервера
});

//Routing для /contact
router.get("/contact", (req, res, next) => {
  res.render("contact", { title: "Contact with me" }); //то что будет отображаться при запуске сервера
});

// Обработка формы
router.post("/contact", async (req, res, next) => {
  // записываем данные, которые приходят из формы в "..", "data", message.json, предварительно приведя данные в необходимый вид
  await fs.writeFile(
    path.join(__dirname, "..", "data", " message.json"),
    JSON.stringify(req.body, null, 2)
  );
  // те данные, которые приходят redirect
  await res.redirect("/");
});

//Routing для /blog
router.get("/blog", (req, res, next) => {
  res.render("blog", { title: "My Blog", articles }); //то что будет отображаться при запуске сервера и пробрасываем articles из ../data/data.json"
});

module.exports = router;
