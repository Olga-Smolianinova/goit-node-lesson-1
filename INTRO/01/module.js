// Подключение через Common JS.
// описываем функции
const info = (msg) => {
  console.log(`Info: ${msg}`);
};

const log = (msg) => {
  console.log(`Log: ${msg}`);
};

// Способы export из модуля
// 1
// exports.log = log; //не рекомендовано использовать, т.к.это ссылка на module.exports, и если ошибиться можно эту ссылку перезаписать, что приведет к ошибкам

// 2 module.exports - это глобальное свойство, его перезаписать нельзя
// module.exports.info = info;
// module.exports.log = log;

// 3 можно фнкции info, log - передать объектом
module.exports = { info, log };
