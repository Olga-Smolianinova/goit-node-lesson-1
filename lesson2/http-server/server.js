//создание простого http-сервера с помощью встроенного модуля http и с использованием только втроенных методов. http-сервер работает с GET

// MODULE
const http = require("http"); //подключаем встроенный модуль http.

// Для https - нужно подключать специальные сертификаты. Можно использовать утилиту ngrok. Она бесплатная и дает возможность запустить виртуальный http- и https-сервера, которые видны в сети

const fs = require("fs").promises; //подключение модуля fs, с еще одним вариантов прописания promises, но этот способ при написании тестов и тестировании не очень хорошо себя ведет, поэтому лучше подключать const fs = require("fs/promises")

const url = require("url"); // т.к. будет работать с url, подключаем встроенный модуль для него
const path = require("path");

const querystring = require("querystring"); //модуль для распаковки

const PORT = 3030;
const STATUS_OK = 200;

// в зависимости от расширения файла будет указывать сontent Type, которые мы будем отправлять
const TypeMime = {
  ".html": "text/html",
  ".htm": "text/html", //старая версия до HTML5
  ".js": "text/javascript",
  ".css": "text/css",
  //   для картинок
  ".png": "image/png",
  ".jpg": "image/jpg",
  // ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

http
  .createServer(async (req, res) => {
    // Распарсиваем {pathname} URL и доменное имя. Новый способ
    const { pathname } = new URL(req.url, "http://localhost:3000/"); // когда будет запрашиваться pathname, будет приходить путь к нашему файлу

    //создаем роутинг. Создаем filename, который нужно прочитать и отдать браузеру
    let filename = pathname;

    switch (pathname) {
      case "/":
        filename = "index.html";
        break;

      case "/contact":
        filename = "contact.html";
        break;

      case "/blog":
        filename = "blog.html";
        break;

      default:
        break;
    }

    // читаем content, создается полное имя для пути
    const content = await fs.readFile(path.join(__dirname, filename));

    //    нужно вытащить type. из TypeMime с помощью extname извлекаем расширение и передаем filename. Т.е. мы идем в filename, вытаскиваем из него расширение (.html или .css), с помощью подстановки из этого объекта будет возвращаться contentType (или "text/html" или "text/javascript" и т.д., т.е. какие файлы появятся, те и будем отдавать)
    const contentType = TypeMime[path.extname(filename)];
    res.writeHead(STATUS_OK, { "Content-Type": contentType });
    res.write(content); //что будет выведено. write - это поток передачи данных
    res.end(); //то, что мы закончили поток выдачи
    // чтобы отдать статику
  })
  .listen(PORT, () => {
    console.log(`Server run on port: ${PORT}`);
  });

// // Создание сервера по видео для 20 групы
// // у http есть функция createServer(), делаем ее асинхронной. req, res - то, что запрашивается и то, что отдается. req имеет много методов, будем с ними постепенно знакомится; res - имеет 3 метода - это ответ, writeHead, write, end
// http
//   .createServer(async (req, res) => {
//     // создание простейшего варианта сервера
//     // res.write("Hello, world!"); //что будет выведено
//     // res.end(); //то, что мы закончили поток выдачи

//     // Актуальный способ
//     // Распарсиваем {pathname} URL и доменное имя. Новый способ
//     const { pathname } = new URL(req.url, "http://localhost:3000/"); // когда будет запрашиваться pathname, будет приходить путь к нашему файлу

//     //   Устаревший способ
//     // чтобы отдать статику  распарсим url, pathname - это путь файла
//     // const { pathname } = url.parse(req.url); //url.parse - устарел

//     //   закидываем req.url и достаем pathname
//     // const myURL = url.parse(req.url);
//     // const pathname = myURL.pathname;

//     //   выкидываем первую часть из pathname - это /
//     let filename = pathname.substring(1);

//     //   строим простейший routing, в котором будем просто менять filename. filename - мы считываем. Ставим только основные, все остальные файлы из папки assets к routing не относится, это не точка входа для нашей логики, а это дополнительный запрос для нашего сервера о вспомогательных ресурсах, и отдавать мы их будем просто как файл для браузера. А в routing по указанномуurl - мы будем отдавать .html файл
//     switch (pathname) {
//       case "/":
//         filename = "index.html";
//         break;

//       case "/contact":
//         filename = "contact.html";
//         break;

//       case "/blog":
//         filename = "blog.html";
//         break;

//       default:
//         break;
//     }

//     // нужно установить перехватчик при POST-запросе. Срабатывают т.н. stream - это значить, что данные формы будут передаваться по частям, небольшими chunk.
//     if (pathname === "/contact" && req.method === "POST") {
//       const body = [];

//       // на req мы вешаем обработчик события на data, когда форма начала присылать данные, который будет их слать частями (chunk).
//       req.on("data", (chunk) => {
//         // и мы в наш массив body.push эти части (chunk)
//         body.push(chunk);
//       });

//       // Когда браузер закончить слать эти (chunk), на событие "end" - будем использовать асинхронную функцию, но в "end" - никогда ничего не передается. Если произошло событие при передаче - нужно повесить обработчик события req.on('error'), и если 'error' - будем возвращать
//       req.on("end", async () => {
//         console.log(body); // ответ - Buffer

//         // чтобы преобразовать Buffer используем decodeURIComponent(), который будет декодировать кириллические символы и статический метод Buffer.concat, в который передаем body и преобразовываем в toSting
//         const parsedBody = decodeURIComponent(Buffer.concat(body).toString());
//         console.log(parsedBody); //введенные данные в форму приходят так: name=olga&email=1@test.com&text=test

//         // У querystring есть метод parse, в который передаем parsedBody и он приведет данные в нормальный вид
//         const parsedObj = querystring.parse(parsedBody);
//         //теперь выглядят так
//         // [Object: null prototype] {
//         //   name: 'olga',
//         //   email: '1@test.com',
//         //   text: 'test'
//         // }
//         console.log(parsedObj);

//         await fs.writeFile("message.json", JSON.stringify(parsedObj, null, 2));
//       });

//       // установим statusCode = 302, что нужно выполнить redirect
//       res.statusCode = 302;

//       // установим заголовок "Location". Когда браузер видит такой заголовок, он просто сюда приходит и переходит на этот url
//       res.setHeader("Location", "/contact");

//       // чтобы дальше выполнение не пошло
//       return res.end();
//     }

//     //   нужно вытащить type. из TypeMime с помощью extname извлекаем расширение и передаем filename. Т.е. мы идем в filename, вытаскиваем из него расширение (.html или .css), с помощью подстановки из этого объекта будет возвращаться contentType (или "text/html" или "text/javascript" и т.д., т.е. какие файлы появятся, те и будем отдавать)
//     const type = TypeMime[path.extname(filename)];

//     //   есть 2 ситуации: мы отдаем бинарное число (это пока только в одном случае если есть сам type, и в строке мы ищем 'image'.  image - это Buffer и мі должні отдать бинарник), в противном случае -  utf-8
//     if (type && type.includes("image")) {
//       try {
//         // достаем саму картинку. readFile - это наш filename, по какому пути запрашиваем, по такому и читаем
//         const img = await fs.readFile(filename);

//         //   устанавливаем заголовок. 1-м идет статус - 200, прочитали удачно; 2 - прописываем contentType: указываем type той картинки, которую передаем
//         res.writeHead(200, { "Content-Type": type });

//         // (1 параметр - img; 2 - "hex" - 16-ричный формат )
//         res.write(img, "hex");

//         // и закрываем соединение
//         res.end();
//       } catch (e) {
//         // если картинки не было или поступил запрос о несуществующей картинке, выводим ошибку
//         console.log(e.message);

//         // устанавливаем заголовок 404 и выводим только текст
//         res.writeHead(404, { "Content-Type": "text/plain" });

//         // // и закрываем соединение
//         res.end();
//       }
//     } else {
//       //   в противном случае будет отдаваться небинарник
//       try {
//         // достаем уже не картинку картинку, а это м.б. html, js, css, т.е. мы не знаем что это. readFile - это наш filename, по какому пути запрашиваем, по такому и читаем его уже в формате utf-8
//         const content = await fs.readFile(filename, "utf-8");

//         //   устанавливаем заголовок. 1-м идет статус - 200, прочитали удачно; 2 - прописываем contentType: указываем type
//         res.writeHead(200, { "Content-Type": type });

//         // передаем content
//         res.write(content);

//         // и закрываем соединение
//         res.end();
//       } catch (e) {
//         // если content не было, выводим ошибку
//         console.log(e.message);

//         // если type неопределен или вообще такого type нет ||или запросили несуществующий html, в этом случае четко читаем страницу 404.html
//         if (!type || type === "text/html") {
//           const content = await fs.readFile("404.html", "utf-8");

//           //   устанавливаем заголовок. 1-м идет статус - 200, прочитали удачно; 2 - прописываем contentType: указываем 'text/html'
//           res.writeHead(200, { "Content-Type": "text/html" });

//           // передаем content
//           res.write(content);
//         } else {
//           // устанавливаем заголовок 404 и выводим только текст
//           res.writeHead(404, { "Content-Type": "text/plain" });
//         }

//         // и закрываем соединение
//         res.end();
//       }
//     }

//     //   в end можно передавать все что угодно, передаем pathname
//     // res.end(pathname);
//   })
//   .listen(3000, () => console.log("Listen server on port 3000")); //listen - запуск метода прослушки (порт, и что он выбед выводить)
