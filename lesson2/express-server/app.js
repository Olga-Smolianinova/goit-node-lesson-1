const createError = require("http-errors"); //модуль для создания ошибок
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser"); //есть cookie, они подключены, пока не нужны, но в конспекте описаны
const logger = require("morgan"); // это logger, который выполняет логирование

const indexRouter = require("./routes/index"); //роутинг
const usersRouter = require("./routes/users"); //роутинг

const app = express();

// view engine setup
// это шаблонизатор подключения. set - это установка переменных, т.е мы для express устанавливаем переменную views, в которой лежит путь к нашим шаблонам. Т.е. когда будет вызываться метод render из routes/index.js express будет искать эту переменную и брать отсюда шаблон
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //это тип шаблона. express из коробки поддерживает очень много шаблонов, ejs - это npm, который подключен в package.json; можно подключить другой, если есть необходимость

app.use((req, res, next) => {
  const date = new Date();
  console.log(
    `${req.method} ${req.url} ${date.toLocaleDateString(
      "em-Us"
    )}:${date.toLocaleTimeString("em-Us")}`
  );
  next();
}); //напишем свой логгер, чтобы промежуточное ПО выполнялось дальше самое важное - это выполнить next()

app.use(logger("dev")); //подключение логгера, который будет выводится в console, и мы будем видеть результат, для режима разработки
// app.use(logger("short")); //логгер для режима production; параметром в терминале будет IP(::1); глагол (GET, POST и т.д.); URL. В качестве пакетов для логгирования можно дополнительно подключить - Morgan - это по умолчанию; Winston - более популярен и гибче, есть возможность класть логи в разные файлы

//подключаем с помощью промежуточного ПО (или middlewar, можно называть и так, и так) подключаем обработку JSON данных и обработку форм данных. В JSON - есть несколько параметров, один из них, например {limit:}, который указывается в байтах и является ограничителем JSON по передаче данных. Это хорошая практика - вводить такие ограничения
app.use(express.json({ limit: 100000 }));
app.use(express.urlencoded({ extended: false })); // движок распарсинга данных меняется, по умолчанию false; true - используется когда мы извращаемся и начинаем передавать много радиокнопок с разными данными, практически не используется

app.use(cookieParser()); //подключение cookieParser
app.use(express.static(path.join(__dirname, "public"))); //указываем статику, которая, как указано будет находиться в папке public

app.use("/", indexRouter); //это будет наш сайт
app.use("/users", usersRouter);

// catch 404 and forward to error handler
// здесь формируется ошибка 404
app.use((req, _, next) => {
  next(
    createError(404, `Извините, по маршруту ${req.url} ничего не обнаружено`)
  );
});

// error handler
//  в express реализовано так, что все ошибки приходят сюда. Есть ошибки выполнения, ошибки самого программиста, есть ошибки сторонних серверов. Нельзя менять параметры, которые передаются
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message; //express предлагает хранить переменные в res.locals,т.е. если нужно какие-либо временные переменные сохранить, мы их сохраняем таким образом здесь, и эти переменные будут также доступны в шаблонах
  res.locals.error = req.app.get("env") === "development" ? err : {}; //если режим development, если есть переменная окружения "env", то мы эту ошибку передаем, а если это production - в этом случае ничего не передаем

  // render the error page
  res.status(err.status || 500); //если статуса нет - ошибка 500 - общая ошибка выполнения
  res.render("error"); //render шаблон error
});

module.exports = app;
