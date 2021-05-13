// INTRO - JS на стороне сервера
// Подключение через Common JS. Применяется require ( - это функция Node, которая подгружает модуль). Модули синхронные

// Как подключить модуль
// 1
const myModule = require("./module");

// myModule.info("Hello, world!");
// myModule.info("Hi, I am Info");
// myModule.log("Hi, I am Log");

// 2
const { info, log } = require("./module");
info("Hello, world!");
info("Hi, I am Info");
log("Hi, I am Log");
