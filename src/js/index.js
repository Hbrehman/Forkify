import Search from './models/Search';
import Recipe from './models/Recipe';


import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';


/** Global State of app
 * - Search object
 * - Current recipe object
 * - Shopping list
 * - Liked recipes 
 */

const state = {};


const controlSearch = async ()=> {
    // 1) get search query from view
    const query = searchView.getInput();
    if (query) {
        
        // 2) create new search object and add to state
        state.search = new Search(query); 
        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4) Search for recipes
        try {
            await state.search.getResults();
            // Clear loader
            clearLoader(elements.searchRes);
            // 4) render results on UI
            searchView.renderResults(state.search.result)
    
            console.log(state.search.result);
        } catch(ex) {
            alert('Error Processing Search...');
            console.log(ex);
            clearLoader(elements.searchRes);
        }
    }

}

elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    controlSearch();
})



elements.searchResPage.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const page = parseInt(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, page);
    }
})


const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    
    if (id) {

        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected recipe
        if (state.search) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
    
            state.recipe.calcTime();
            state.recipe.calcServings();
            recipeView.renderRecipe(state.recipe);
            clearLoader(elements.recipe);
            console.log(state.recipe);
        } catch(ex) {
            alert('Error processing recipy...');
            console.log(ex);
        }
    }
}

['hashchange', 'load'].forEach(event=>window.addEventListener(event, controlRecipe));

// Handling recipe button clicks


elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        state.recipe.updateServings('dec');

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('Inc');
        
    }
    console.log(state.recipe);
})