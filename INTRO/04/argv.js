//  можем писать любые данные .json

// top level await. Работает только при import
// При Ecms Script Module top level позволяет писать await вне асинхронной функции, глобально

// подключаем File System Module (с использованием promise)
const fs = require("fs/promises");

const argv = process.argv;

// поскольку подключены promise, чтобы ими пользоваться используем паттерн - анонимная самовызывающаяся функция (() => {})()
// Ранее(до 2015) вся модульная система JS строилась именно таким образом

// ;(() => {})() - ; ставится, чтобы код не сливался в кучу, если ее забывали поставить в конце выражения

// принимает файл data.json
(async () => {
  // читаем данные из data.json
  const data = await fs.readFile("data.json", "utf-8");
  // выводим
  //   console.log(data);

  const content = JSON.parse(data);

  // проверка, если под 2 индексом массива argv не будет ==="--list", то нужно распарсить данные, в противном случае - в режиме добавления, добавляем данные
  if (argv[2] === "--list") {
    console.table(content);
  } else {
    const name = argv[2];
    const age = argv[3];

    //   и данные .push в content
    content.push({ name, age });

    // записываем и сохраняем в data.json, приведя их к правильному синтаксису JSON.stringify(content, null, 2 отступа))
    await fs.writeFile("data.json", JSON.stringify(content, null, 2));
  }
})();

// чтобы не писать распарсивание вручную используем дополнительные плагины, к примеру commander, yargs
