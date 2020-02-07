import axios from "axios";

export default class Recipe  {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.result = result.data.recipe;
            
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch(ex) {
            alert(ex);
        }

    }
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = 4;
    }
    parseIngredients() {

        // uniform units
        const longUnits = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const shortUnits = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        let newIngredients = this.ingredients.map((ingredient) => {
            ingredient = ingredient.toLowerCase();
            longUnits.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, shortUnits[i]);
            });
        // 2) Remove parentheses
        ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      

        // Parse ingredients into count, unit and ingredients
        let arrIng = ingredient.split(' ');
        let unitIndex = arrIng.findIndex(el => shortUnits.includes(el));
        
        let objIng;
        if (unitIndex > -1) {
            // Ingredients include unit
            const arrCount = arrIng.slice(0, unitIndex);
            let count;
            if (arrCount.length === 1) {
                count = eval(arrIng[0].replace('-', '+'));
            } else {
                count = eval(arrIng.slice(0, unitIndex).join('+'))
            }

            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex+1).join('')
            };

        } else if (parseInt(arrIng[0], 10)) {
            // There is no unit but first element of array is number...
            objIng = {
                count: parseInt(arrIng[0], 10),
                unit: '',
                ingredient: arrIng.slice(1).join(' ')
            }
        } else if (unitIndex == -1) {
            // Ingredients don't include unit...
            objIng = {
                count: 1,
                unit: '',
                ingredient
            }
        }

        return objIng;
        })  
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;// Ingredients

        this.ingredients.forEach(ing => {
            ing.count *=  (newServings / this.servings);
        })


        this.servings = newServings; 
    }
}