// top level await. Работает только при import
// При Ecms Script Module top level позволяет писать await вне асинхронной функции, глобально

// подключаем File System Module (с использованием promise)
const fs = require("fs/promises");

// подключаем file, прописываем путь к нему, чтобы его прочитать
const file = "../03/main.js";

// поскольку подключены promise, чтобы ими пользоваться используем паттерн - анонимная самовызывающаяся функция (() => {})()
// Ранее(до 2015) вся модульная система JS строилась именно таким образом

// ;(() => {})() - ; ставится, чтобы код не сливался в кучу, если ее забывали поставить в конце выражения

// функцию fileName определяем, и сразу же ее вызываем вконце
(async (fileName) => {
  // читаем
  const file = await fs.readFile(fileName);
  // выводим
  //   console.log(file.toString());

  // записываем и сохраняем, указываем путь (temp. Файл temp пишется только в существующей папке ), выводим в записанном файле внизу то, что нужно или хочется добавить
  await fs.writeFile("temp.js", `${file} console.log("Hello")`);
})(file);

//1 Результатом вызова fileName
// console.log(file)})(file);
// (node readwrite.js) будет Buffer(количество битов)

// 2) console.log(file.toString())})(file) - текст file (file = "../03/main.js");

// 3) вторым параметром передаем доп.опции
// (async (fileName) => {
//   const file = await fs.readFile(fileName, "utf-8");
//   console.log(file);
// })(file);

// если нужно создать папку в папке добавить
// await fs.mkdir("temp");

// чтобы проверить существует или не существует необходимая папка (чтобы не выдавало ошибку или повторно не создавало туже самую папку) используется fs.access
// fs.access - проверяет есть ли у нас доступ к файлу. Добавляем выше асинхронную функцию, которая возвращает true или false
// const isAccessible = async (path) => {
//   try {
//     await fs.access(path);
//     return true;
//   } catch (e) {
//     return false;
//   }
// };

// (async (fileName) => {
//   // читаем
//   const file = await fs.readFile(fileName);
//   // выводим
//   //   console.log(file.toString());

//   //  добавляем проверку, если папки temp нет, то нужно создать папку в папке temp
//   if (!isAccessible("temp")) {
//     await fs.mkdir("temp");
//   }

//   // записываем и сохраняем, указываем путь (temp. Файл temp пишется только в существующей папке ), выводим в записанном файле внизу то, что нужно или хочется добавить
//   await fs.writeFile("temp.js", `${file} console.log("Hello")`);
// })(file);
