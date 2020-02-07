import { elements } from './base';

export const getInput = ()=> elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = ''
};
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPage.innerHTML = '';
};

export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active');
}


 const renderRecipes = (c) => {
     const limitRecipeTitle = (title, limit = 17) => {
         const newTitle = [];
         if (title.length > 17) {
             title.split(' ').reduce((acu, cur) => {
                if (acu + cur.length < limit) {
                    newTitle.push(cur);
                }
                return acu + cur.length;
             }, 0)
             return `${newTitle.join(' ')} ...`;
         }
         return title;
     }


    const markup = `<li>
        <a class="results__link" href="#${c.recipe_id}" data-goto="${c.recipe_id}">
            <figure class="results__fig">
                <img src="${c.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(c.title)}</h4>
                <p class="results__author">${c.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

const createBtn = (page, type) => {
    return `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'next' ? page + 1 : page - 1}>
            <span>Page ${type === 'next' ? page + 1 : page - 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' :'left'}"></use>
            </svg>
        </button>
    `;
}
const renderButtons = (page, numOfResults, resPerPage) => {
    const pages = Math.ceil(numOfResults / resPerPage);
    let Button;
    if (page === 1 && pages > 1) {
        // create only one next button 
        Button = `${createBtn(1, 'next')}`;
    } else if (page < pages) {
        //create Both buttons
        Button =
         `${createBtn(page, 'prev')}
         ${createBtn(page, 'next')}`;
    } else if (page === pages && pages > 1) {
        Button =   `${createBtn(pages, 'prev')}`

    }
    elements.searchResPage.insertAdjacentHTML('afterbegin', Button);
}

export const renderResults = (recipes, page = 1 ,resPerPage = 10) =>  {
    const start = (page - 1) * 10;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipes);
    renderButtons(page, recipes.length, resPerPage);
}
