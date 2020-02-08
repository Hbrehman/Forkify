import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';


import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';


/** Global State of app
 * - Search object
 * - Current recipe object
 * - Shopping list
 * - Liked recipes 
 */

const state = {};
window.state = state;

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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            clearLoader(elements.recipe);
        } catch(ex) {
            alert('Error processing recipy...');
            console.log(ex);
        }
    }
}

['hashchange', 'load'].forEach(event=>window.addEventListener(event, controlRecipe));


/**
 * LIST CONTROLLER
 */

 const controlList = () => {
     // Create a new list if there is none one
     if (!state.list) state.list = new List();

     // Add each ingredient to list and UI 

     state.recipe.ingredients.forEach(el => {
         const item = state.list.addItem(el.count, el.unit, el.ingredient);
         listView.renderItem(item);
     })
 }

 state.likes = new Likes();
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLikes(
            currentID, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle like button
        likeView.toggleLikeView(true);
        // Add like to UI
        likeView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
    // Remove like from state
        state.likes.deleteLike(currentID);
    // Toggle the like button
        likeView.toggleLikeView(false);

    // Remove like from UI list
        likeView.deleteLike(currentID);
        console.log(state.likes);

    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());

}

 //Handle delete and update list item events

 elements.shopping.addEventListener('click', e=> {
     const id = e.target.closest('.shopping__item').dataset.itemid;
    if (id) {
        console.log(id);
        // Handle the delete 
        if (e.target.matches('.shopping__delete, .shopping__delete *')) {
            // Delete from state
            state.list.deleteItem(id);
   
            // Delete from UI
            listView.deleteItem(id);

            // Handle count update
        } else if (e.target.matches('.shopping__count-value')) {
            const val = parseFloat(e.target.value, 10);
            state.list.updateCount(id, val);
        } else if (e.target.matches('.recipe__love, .recipe__love *')) {
            // Like controller
            controlLike();   
        }
    } else {
        console.log(' id not found...');
    }
 })

// Handling recipe button clicks

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('Inc');
        recipeView.updateServingsIngredients(state.recipe);
        
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
})


window.l = new List();