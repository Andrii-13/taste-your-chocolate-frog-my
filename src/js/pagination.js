import { fetchCards } from './API/grid-cards-api';
import { createMarkupGridCard } from './grid-card-fetch';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import {getQueryNameRecipes} from './filters-fetch';
// import { debounce } from 'debounce';

const loader = document.querySelector('.loader');
const elements = {
  btnsPagesBox: document.querySelector('.js-btns-pages'),
  pagWrap: document.querySelector('.js-pag-wrap'),
  btnsBack: document.querySelector('.btns-back'),
  btnsEnd: document.querySelector('.btns-forward'),
  btnFin: document.querySelector('.pag-forward-btn'),
};

let pages = 8; //кількість сторінок
let quantMobbtn = 3; // кількість кнопок сторінок в моб варіанті

let currentPage = 1; //поточна сторінка
let currentlimit; // рецептів на сторінці

setCardsLimitTest();

function setCardsLimitTest() {
  if (window.screen.width >= 768 && window.screen.width < 1200) {
    currentlimit = 8;
    quantMobbtn = 4;
    defaultDataTest(currentPage, currentlimit);
  } else if (window.screen.width >= 1200) {
    currentlimit = 9;
    quantMobbtn = 4;
    defaultDataTest(currentPage, currentlimit);
  } else {
    currentlimit = 6;
    quantMobbtn = 3;
    defaultDataTest(currentPage, currentlimit);
  }
  setCardsLimitResizerTest();
}

getTotalPages(currentPage, currentlimit).then(resp => {
  pages = resp;
  return pages;
});

setCardsLimitResizerTest();

function setCardsLimitResizerTest() {
  window.addEventListener('resize', function () {
    if (window.screen.width >= 768 && window.screen.width < 1200) {
      currentlimit = 8;
      quantMobbtn = 4;
      defaultDataTest(currentPage, currentlimit);
      return quantMobbtn;
    } else if (window.screen.width >= 1200) {
      currentlimit = 9;
      quantMobbtn = 4;
      defaultDataTest(currentPage, currentlimit);
      return quantMobbtn;
    } else {
      currentlimit = 6;
      quantMobbtn = 3;
      defaultDataTest(currentPage, currentlimit);
      return quantMobbtn;
    }
  });
}

elements.btnsPagesBox.addEventListener('click', handlerBattonPag);
elements.pagWrap.addEventListener('click', handlerBattonArrow);

quantityBtn(pages);

function quantityBtn(quantityPages) {
  elements.btnsPagesBox.innerHTML = markupBtnPagination(quantityPages);
}

function markupBtnPagination(pages) {
  const arrBtn = [];

  for (let i = 1; i <= pages; i += 1) {
    if (i === quantMobbtn && pages === quantMobbtn) {
      arrBtn.push(
        `<button type="button" class="pag-page-btn pag-btn">${i}</button>`
      );
      continue;
    }
    // if (i === quantMobbtn && pages !== quantMobbtn) {
    //   arrBtn.push(
    //     `<button type="button" class="pag-page-btn pag-btn additional-btn">...</button>`
    //   );
    //   continue;
    // }
    else
      arrBtn.push(
        `<button type="button" class="pag-page-btn pag-btn">${i}</button>`
      );
  }
  if (arrBtn.length <= quantMobbtn) {
    elements.btnsBack.classList.add('visually-hidden');
    elements.btnsEnd.classList.add('visually-hidden');
  }
  arrBtn.splice(
    0,
    1,
    `<button type="button" class="pag-page-btn pag-btn btn-active">1</button>`
  );
  const visualBtn = pages - (pages - quantMobbtn);
  const allBtn = arrBtn.slice(0, visualBtn);

  return allBtn.join('');
}

function handlerBattonPag(e) {
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }

  const currentActiveBtn = document.querySelector('.btn-active');
  // якщо нажимаємо на активну кнопку то не робить запиту на бєк, а пририває функцію
  if (e.target === currentActiveBtn) {
    return;
  }
  loader.classList.remove('hidden');

  if (currentActiveBtn) {
    currentActiveBtn.classList.remove('btn-active');
  }
// задаємо умову, щоб кнопки переходили на +1
  if (e.target) {
    e.target.classList.add('btn-active');
    if (
      !e.target.nextSibling &&
      Number(e.currentTarget.lastChild.textContent) !== pages
    ) {
      console.dir(e.currentTarget.lastChild.textContent);
      elements.btnsPagesBox.innerHTML = btnPageMarkupFront(
        Number(e.target.textContent),
        pages
      );
    }

    // if (!e.target.previousSibling) {
    //     console.log(currentActiveBtn.textContent);
    //   elements.btnsPagesBox.innerHTML = btnPageMarkupBack(
    //     Number(e.target.textContent),
    //     pages
    //   );
    // }

    currentPage = Number(e.target.textContent);
    //console.dir(Number(e.target.textContent));

    // зміна розмітки
    defaultDataTest(currentPage, currentlimit);
    // з цього отримується номер сторінки, вставити функцію розмітки сторінки
  }
}

const cards = document.querySelector('.list-recipes');

async function defaultDataTest(currentPage, currentlimit) {
  try {
    const result = await fetchCards(currentPage, currentlimit);
    cards.innerHTML = createMarkupGridCard(result.results);
    loader.classList.add('hidden');
    // pages = result.totalPages;
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

async function getTotalPages(currentPage, currentlimit) {
  try {
    const result = await fetchCards(currentPage, currentlimit);
    // cards.innerHTML = createMarkupGridCard(result.results);
    const backPages = result.totalPages;
    return backPages;
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

// ==================================================================================
//                  Pagination battons
// ==================================================================================

function handlerBattonArrow(e) {
  if (e.target.classList.contains('pag-end-btn')) {
    loader.classList.remove('hidden');
    elements.btnsPagesBox.innerHTML = markupEndBattons(pages);
    const currentActiveBtn = document.querySelector('.btn-active');
    const choosePage = currentActiveBtn.textContent;
    defaultDataTest(choosePage, currentlimit);
  }
  if (e.target.classList.contains('pag-start-btn')) {
    elements.btnsPagesBox.innerHTML = markupBtnPagination(pages);
    const currentActiveBtn = document.querySelector('.btn-active');
    const choosePage = currentActiveBtn.textContent;
    defaultDataTest(choosePage, currentlimit);
  }
  if (e.target.classList.contains('pag-forward-btn')) {
    const currentActiveBtn = document.querySelector('.btn-active');
    if (Number(currentActiveBtn.textContent) <= pages - 1) {
      if (currentActiveBtn.nextSibling) {
        currentActiveBtn.nextSibling.classList.add('btn-active');
        currentActiveBtn.classList.remove('btn-active');
      }
      defaultDataTest(Number(currentActiveBtn.textContent) + 1, currentlimit);

      btnPageMarkupFront(Number(currentActiveBtn.textContent), pages);

      if (
        Number(currentActiveBtn.textContent) ===
        Number(elements.btnsPagesBox.lastChild.textContent) - 1
      ) {
        if (Number(elements.btnsPagesBox.lastChild.textContent) + 1 <= pages) {
          elements.btnsPagesBox.innerHTML = btnPageMarkupFront();
        }
      }
    }
  }
  // =========================================================================

  if (e.target.classList.contains('pag-back-btn')) {
    const currentActiveBtn = document.querySelector('.btn-active');
    if (Number(currentActiveBtn.textContent) - 1 >= 1) {
      currentActiveBtn.previousSibling.classList.add('btn-active');

      currentActiveBtn.classList.remove('btn-active');
      currentActiveBtn.previousSibling.classList.add('btn-active');
      currentActiveBtn.classList.remove('btn-active');
      const choosePage = Number(currentActiveBtn.textContent) - 1;
      defaultDataTest(choosePage, currentlimit);

      if (Number(elements.btnsPagesBox.firstChild.textContent) - 1 > 0) {
        if (
          Number(elements.btnsPagesBox.firstChild.textContent) ===
          Number(currentActiveBtn.previousSibling.textContent)
        ) {
          elements.btnsPagesBox.innerHTML = btnPageMarkupBack();
        }
      }
    }
  }
}
// ============================================================================

function btnPageMarkupBack() {
  const currentActiveBtn = document.querySelector('.btn-active');

  //console.log(currentActiveBtn);

  const arrBtn = [];

  for (
    let i = Number(currentActiveBtn.textContent) - 1;
    i <= Number(currentActiveBtn.textContent) - 1 + quantMobbtn - 1;
    i += 1
  ) {
    if (i === Number(currentActiveBtn.textContent)) {
      arrBtn.push(
        `<button type="button" class="pag-page-btn pag-btn btn-active">${i}</button>`
      );
      continue;
    }
    arrBtn.push(
      `<button type="button" class="pag-page-btn pag-btn">${i}</button>`
    );
  }
  //console.log(arrBtn);
  return arrBtn.join('');
}

function btnPageMarkupFront() {
  const currentActiveBtn = document.querySelector('.btn-active');
  const nextElem = currentActiveBtn.nextSibling;
  const arrBtn = [];
  if (!nextElem) {
    for (
      let i = Number(currentActiveBtn.textContent) + 1 - quantMobbtn + 1;
      i <= Number(currentActiveBtn.textContent) + 1;
      i += 1
    ) {
      if (i === Number(currentActiveBtn.textContent)) {
        arrBtn.push(
          `<button type="button" class="pag-page-btn pag-btn btn-active">${i}</button>`
        );
        continue;
      } else {
        arrBtn.push(
          `<button type="button" class="pag-page-btn pag-btn">${i}</button>`
        );
      }
    }
  }
  return arrBtn.join('');
}

function markupEndBattons(quantityPages) {
  const arrBtn = [];
  for (let i = quantityPages - (quantMobbtn - 1); i <= quantityPages; i += 1) {
    arrBtn.push(
      `<button type="button" class="pag-page-btn pag-btn">${i}</button>`
    );
  }
  // arrBtn.splice(
  //   0,
  //   1,
  //   `<button type="button" class="pag-page-btn pag-btn additional-btn">...</button>`
  // );
  arrBtn.splice(
    quantMobbtn - 1,
    1,
    `<button type="button" class="pag-page-btn pag-btn btn-active">${quantityPages}</button>`
  );
  const endSetPages = arrBtn.join('');
  return endSetPages;
}
