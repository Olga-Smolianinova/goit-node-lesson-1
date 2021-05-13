// разработка CLI-приложения. Сделаем сортировку картинок по папкам, в зависимости от их расширения

// подключение Commander
import { Command } from "commander";

// Data
import SortFiles from "./sort.js"; //подключаем файл, где прописана основная логика приложения

const program = new Command(); //из файла настроек из репозитория Commander, создание класса командера, у которого есть опции

// для настройки program из репозитория Commander вставляем опции и меняем их под свои задачи. Для создания CLI-приложения есть международные стандарты, которым нужно следовать. Первый параметр  -  короткая запись команды через один дефис (-d); и через два - это длинная запись команды (--debug). Второй параметр - это описание команды ("output extra debugging")
// в угловых скобках <type> можем указывать, что ожидается еще параметр, если ничего не указывать это будет boolen
// requiredOption - обязательные, без этой папки дальше не идем, будем выбрасываться ошибка, в данном случае, если не будет папки picture - это исходник, будет выдаваться ошибка
// опции - это так называемые цепочные функции, каждая из строк возвращает ссылку this на program, на этот класс
program
  .requiredOption("-s, --source <type>", "source folder")
  .option("-o, --output <type>", "output folder", "./dist"); //2 параметр - папка по умолчанию

//   чтобы достать распарсенные данные
program.parse(process.argv);

// достаем из функции program.opts
const { source, output } = program.opts();
// выводим их. В терминале команда node app.js -s picture -o img, чтобы задать имена того, что будет лежать в source, output
// console.log(source, output);

// ===================================================
// чтобы CLI-приложение заработало нужен __filename, __dirname (Эти переменные CommonJS недоступны в модулях ES). __filename и __dirname варианты использования могут быть воспроизведены через import.meta.url. Поэтому вставляем часть следующего кода, используя стандартный подход для этиъ случаев. Этот код нужно будет вставлять в каждый файл, т.к. import.meta.url - уникален для каждого файла. Если мы создаем эту часть кода и export его __filename и __dirname, нужно из того места откуда import пробрасывать import.meta.url, чтобы __filename и __dirname был правильно создан
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
// ======================================================

// делаем sorting, создаем экземпляр класса, и туда прокидываем output. Т.к. import поддерживает top level await - применяем его, даже без применения никакой анонимной функции, просто прописываем sorting с вызовом метода. Приватный метод #copyFile из файла sort.js он не видит, остальные методы из этого файла можно вызывать, поэтому обращаемся readFolder, и прокидываем resolve - абсолютный путь (можно использовать вместо resolve - join ). Также обрабатываем ошибки и не забыть прописать exit - завершение работы
//  await sorting.readFolder(resolve(__dirname, source)) - прочитает, source передаем при инициализации readFolder; const sorting = new SortFiles(output) - в output положить, output передаем при инициализации sorting ; и отправить в sort.js - это будет base
try {
  const sorting = new SortFiles(output);
  await sorting.readFolder(resolve(__dirname, source));
} catch (e) {
  console.log(e.message);
  process.exit(1);
}

console.log("Completed");
