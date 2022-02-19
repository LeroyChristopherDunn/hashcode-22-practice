import {Input} from "./InputReader";
import {Ingredients} from "./OutputWriter";

export function evaluate(input: Input, ingredients: Ingredients): number{
    const ingredientsSet = new Set(ingredients);
    let score = 0;
    for (let customer of input.customers) {
        let satisfiedCustomer = true;
        for (let like of customer.likes) {
            if (!ingredientsSet.has(like)){
                satisfiedCustomer = false;
                break;
            }
        }
        if (satisfiedCustomer)
            for (let dislike of customer.dislikes) {
                if (ingredientsSet.has(dislike)){
                    satisfiedCustomer = false;
                    break;
                }
            }
        if (satisfiedCustomer) score += 1;
    }
    return score;
}