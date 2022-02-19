import {Input} from "./InputReader";
import {Ingredients} from "./OutputWriter";

export function allLikedIngredients(input: Input): Ingredients{
    const allLikedIngredients = new Set<string>();
    input.customers.forEach(customer => {
        customer.likes.forEach(ingredient => allLikedIngredients.add(ingredient));
    })
    return Array.from(allLikedIngredients);
}

export function allIngredientsThatAreNotDisliked(input: Input): Ingredients{
    const ingredients = new Set<string>();
    input.customers.forEach(customer => {
        customer.likes.forEach(ingredient => ingredients.add(ingredient));
        customer.dislikes.forEach(ingredient => ingredients.delete(ingredient));
    })
    return Array.from(ingredients);
}

export function ingredientsLikedMoreThanDisliked(input: Input): Ingredients{
    const {likeFreq, dislikeFreq} = ingredientFrequency(input);
    return Object.keys(likeFreq)
        .filter(ingredient => likeFreq[ingredient] >= (dislikeFreq[ingredient] || 0));
}

function ingredientFrequency(input: Input){
    const likeFreq: {[key: string]: number} = {};
    const dislikeFreq: {[key: string]: number} = {};
    input.customers.forEach(customer => {
        customer.likes.forEach(ingredient => {
            likeFreq[ingredient] = (likeFreq[ingredient] || 0) + 1;
        });
        customer.dislikes.forEach(ingredient => {
            dislikeFreq[ingredient] = (dislikeFreq[ingredient] || 0) + 1;
        });
    })
    return {likeFreq, dislikeFreq};
}
