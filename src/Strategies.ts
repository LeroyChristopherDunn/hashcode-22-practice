import {Input} from "./InputReader";
import {Ingredients} from "./OutputWriter";
import {evaluate} from "./Evaluate";
import {GeneticAlg} from "./GeneticAlgorithm";

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

function getAllIngredients(input: Input){
    const ingredients = new Set<string>();
    input.customers.forEach(customer => {
        customer.likes.forEach(ingredient => ingredients.add(ingredient));
        customer.dislikes.forEach(ingredient => ingredients.add(ingredient));
    })
    return ingredients;
}

export function allDislikedIngredients(input: Input): Ingredients{
    const allDislikedIngredients = new Set<string>();
    input.customers.forEach(customer => {
        customer.dislikes.forEach(ingredient => allDislikedIngredients.add(ingredient));
    })
    return Array.from(allDislikedIngredients);
}

export function geneticSearch(input: Input): Ingredients{
    // const allIngredientSet = getAllIngredients(input);
    // const allIngredientsList = Array.from(allIngredientSet);
    const likedIngredientsList = allLikedIngredients(input);
    const likedIngredientsSet = new Set(likedIngredientsList);
    const dislikedIngredientsList = allDislikedIngredients(input);
    const dislikedIngredientsSet = new Set(dislikedIngredientsList);

    let currCandidate: Ingredients = likedIngredientsList.slice(0, likedIngredientsList.length/2);
    let bestCandidate: Ingredients = [...currCandidate];
    let bestCandidateScore = 0;

    const mutate = (ingredients: Ingredients) => {
        const ingredientsSet = new Set(ingredients);

        // add
        const shouldAdd = Math.random() > 0.5 || !ingredients.length;
        const canAdd = ingredients.length < likedIngredientsList.length;
        if (shouldAdd && canAdd){
            let i = 0;
            while (i < 1000){
                const randomIndex = Math.round(Math.random() * (likedIngredientsList.length - 1));
                const randomIngredient = likedIngredientsList[randomIndex];
                if (!ingredientsSet.has(randomIngredient)){
                    ingredientsSet.add(randomIngredient);
                    break;
                }
                i++;
            }
        }

        // remove
        const shouldRemove = Math.random() > 0.5;
        const canRemove = ingredients.length > 0;
        if (shouldRemove && canRemove && dislikedIngredientsList.length){
            let i = 0;
            while (i < 1000){
                const randomIndex = Math.round(Math.random() * (dislikedIngredientsList.length - 1));
                const randomIngredient = dislikedIngredientsList[randomIndex];
                if (ingredientsSet.has(randomIngredient)){
                    ingredientsSet.delete(randomIngredient);
                    break;
                }
                i++;
            }
        }

        return Array.from(ingredientsSet);
    }

    for (let i = 0; i < 20000; i++) {
        currCandidate = mutate(currCandidate);
        // console.log('currCandidate', currCandidate)
        const score = evaluate(input, currCandidate);
        // console.log('currCandidate score', score);
        if (score > bestCandidateScore) {
            bestCandidate = [...currCandidate];
            bestCandidateScore = score;
        }
    }

    return bestCandidate;
}

export function geneticSearch2(input: Input): Ingredients {
    const likedIngredientsList = allLikedIngredients(input);
    const dislikedIngredientsList = allDislikedIngredients(input);
    return new GeneticAlg(input, likedIngredientsList, dislikedIngredientsList)
        .run(5000)
}

