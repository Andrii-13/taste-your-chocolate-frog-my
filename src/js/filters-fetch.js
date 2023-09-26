import {
  fetchCardsWithFilters,
  fetchAreas,
  fetchIngredients,
} from './API/filters-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { debounce } from 'debounce';
import { createMarkupGridCard, defaultData } from './grid-card-fetch';
import { quantityBtn, markupBtnPagination } from './pagination';
import SlimSelect from 'slim-select';
import { elements } from './refs';

let currentlimit = 6;
const loader = document.querySelector('.loader');

const arrResipesOnPage = []; // масив з рецептами по сторінках

if (elements.searchInput) {
  elements.searchInput.addEventListener(
    'input',
    debounce(getQueryNameRecipes, 1000)
  );
}

function getQueryNameRecipes(e) {
  loader.classList.remove('hidden');
  const inpunValue = e.target.value.trim();
  //console.log(inpunValue);
  if (inpunValue === '') {
    elements.searchInput.innerHTML = '';
    elements.cards.innerHTML = defaultData(); // якщо написав і стер то вертається дефолтна розмітка
    elements.resetButton.classList.add('js-reset-filters');
    Notify.info('Your query is empty. Please try again');
    quantityBtn(currentlimit);
    return;
  }
  //console.dir(elements.resetButton);
  elements.resetButton.classList.remove('js-reset-filters');
  cardsWithFiltersData(inpunValue, currentlimit);
}

if (elements.resetButton) {
  elements.resetButton.addEventListener('click', clearSearchInput);
}

function clearSearchInput(e) {
  if (e.target) {
    elements.searchInput.value = '';
    elements.cards.innerHTML = defaultData();
    elements.resetButton.classList.add('js-reset-filters');
    quantityBtn(currentlimit);
  }
}

async function cardsWithFiltersData(nameRecipe, currentlimit) {
  try {
    if (window.screen.width >= 768 && window.screen.width < 1200) {
      currentlimit = 8;
    } else if (window.screen.width >= 1200) {
      currentlimit = 9;
    }
    const result = await fetchCardsWithFilters(nameRecipe);
    loader.classList.add('hidden');

    const filterRecipes = result.filter(({ title }) =>
      title.toLowerCase().includes(nameRecipe.toLowerCase())
    );
    // console.log(filterRecipes);

    if (filterRecipes.length === 0) {
      elements.cards.innerHTML = defaultData();
      // elements.resetButton.classList.add('js-reset-filters');
      Notify.warning('Nothing was found for your request!');
      return;
    }
    //##########################################################################

    const filterRecipesDouble = filterRecipes.slice();
    if (elements.searchInput.value !== '') {
      console.dir(elements.searchInput.value);

      for (
        let i = 0;
        i < Math.ceil(filterRecipesDouble.length / currentlimit);
        i += 1
      ) {
        arrResipesOnPage.push(filterRecipes.splice(0, currentlimit));
      }

      elements.cards.innerHTML = createMarkupGridCard(arrResipesOnPage[0]);
      
      
      
      
      // створення логіки натискань на кнопки сторінок при виборі рецепта по інпуту

      
      
      // ++++++++++++++++++  рендер кнопок по факту сторінок

      // при вводі в інпут і стиранні не зявляються стрілочні кнопки.

      elements.btnsPagesBox.innerHTML = markupBtnPagination(
        arrResipesOnPage.length
      );

      

  
    }
  } catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

function handlerBattonPagSearch(e){
console.log(e.target.textContent);
}

/*
====================
SELECT TIME
====================
*/

if (elements.selectTimeButton) {
  let selectTime = [];
  let startTime = 5;
  const step = 5;
  for (let i = 0; startTime <= 120; i++) {
    selectTime.push(startTime);
    startTime += step;
  }
  //console.log(selectTime);
  elements.selectTimeButton.insertAdjacentHTML(
    'beforeend',
    createMarkupSelectTime(selectTime)
  );
  new SlimSelect({
    select: elements.selectTimeButton,
    settings: {
      showSearch: false,
    },
  });
}

function createMarkupSelectTime(arr) {
  return arr
    .map(
      time =>
        `<option class="filter-select-option" value="${time}">${time} min</option>`
    )
    .join('');
}

/*
====================
SELECT AREA
====================
*/
if (elements.selectAreaButton) {
  selectAreaData();
}

async function selectAreaData() {
  try {
    const result = await fetchAreas();
    elements.selectAreaButton.insertAdjacentHTML(
      'beforeend',
      createMarkupSelectArea(result)
    );
    new SlimSelect({
      select: elements.selectAreaButton,
      settings: {
        showSearch: false,
      },
    });
  } catch {
    Notify.failure('Oops! Filters went wrong! Try reloading the page!');
  }
}

function createMarkupSelectArea(arr) {
  return arr
    .map(
      ({ _id, name }) =>
        `<option class="filter-select-option" value=">${name}">${name}</option>`
    )
    .join('');
}

/*
====================
SELECT INGREDIENTS
====================
*/
if (elements.selectIngredientsButton) {
  selectIngredientsData();
}
async function selectIngredientsData() {
  try {
    const result = await fetchIngredients();
    elements.selectIngredientsButton.insertAdjacentHTML(
      'beforeend',
      createMarkupSelectIngredients(result)
    );
    new SlimSelect({
      select: elements.selectIngredientsButton,
      settings: {
        showSearch: false,
      },
    });
  } catch {
    Notify.failure('Oops! Filters went wrong! Try reloading the page!');
  }
}

function createMarkupSelectIngredients(arr) {
  return arr
    .map(
      ({ _id, name }) =>
        `<option class="filter-select-option" value="${name}">${name}</option>`
    )
    .join('');
}
