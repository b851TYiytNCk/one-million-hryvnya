const container = document.querySelector('#content-section');

container.insertAdjacentHTML('beforeend', '<table class="grid"><tbody></tbody></table>');

const tBody = document.querySelector('tbody');

for (let tr, i = 0; i < 10000; ++i) {
  if (!(i % 100))
    tr = tBody.insertRow();
  tr.insertCell();
}
/* переменные, и функция сортировки (для использования в обработчике) */
const mathSort = (a, b) => a - b;
let isMbPressed = false,                      // флаг "кнопка мыши зажата"
    range = [[-1, -1], [-1, -1]];             // координаты "углов" выделенного диапазона ячеек, две точки ([столбец, строка])
/* функция обработчика DOM-событий - в ней основная логика */
const handler = evt => {
  const tr = evt.target.closest('tr');
  const getCoords = () => [                   // функция получения табличных координат мыши
    [...tr.cells].indexOf(evt.target),        // индекс ячейки в строке (X-координата)
    [...tr.parentElement.rows].indexOf(tr),   // индекс строки в таблице (Y-координата)
  ];
  switch (evt.type) {                         // ветвление по типу события
    case 'mouseleave':
      if (evt.target === evt.currentTarget)
        isMbPressed = false;                  // при выходе курсора за границы tbody, снимаем флаг зажатия
      break;
    case 'mousedown':
    case 'mouseup':
      isMbPressed = evt.type === 'mousedown';
      range[+!isMbPressed] = getCoords();     // если событие зажатия, запомним как координаты начальной точки (range[0]), иначе как координаты конечной точки (range[1])
    case 'mousemove':
      if (!isMbPressed) break;                // движения мыши без зажатой кнопки не обрабатываем
      range[1] = getCoords();                 // обновляем координату конечной точки диапазона
      console.clear(), console.log(JSON.stringify(range));
      const [col1, col2] = [range[0][0], range[1][0]].sort(mathSort),     // возьмем X-координаты по возрастанию их значений
            [row1, row2] = [range[0][1], range[1][1]].sort(mathSort);     // и Y-координаты аналогично
      [...tBody.rows].forEach((tr, row) => {
        const inRowRange = (row >= row1) && (row <= row2);
        [...tr.cells].forEach((td, col) => {
          const inColRange = (col >= col1) && (col <= col2);
          td.style.background = inRowRange && inColRange ? '#def' : '';   // установка цвета фона ячейки: при вхождении в диапазон и по X и по Y - голубой цвет (выделение), иначе - никакого цвета (нет выделения)
        });
      });
  }
};
['mousedown', 'mouseup', 'mousemove', 'mouseleave'].forEach(   // перебор имен (типов событий), их будет обрабатывать одна общая функция
  evtType => tBody.addEventListener(evtType, handler)          // обработка всех событий на их всплытии (делегируем ее tbody)
);