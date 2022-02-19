import {Input} from "./InputReader";
import {Ingredients} from "./OutputWriter";

export function allLikedIngredients(input: Input): Ingredients{
    const allLikedIngredients = new Set<string>();
    input.customers.forEach(customer => {
        customer.likes.forEach(ingredient => allLikedIngredients.add(ingredient));
    })
    return Array.from(allLikedIngredients);
}