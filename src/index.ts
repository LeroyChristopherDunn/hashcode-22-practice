import {Input, InputReader} from "./InputReader";
import {OutputWriter} from "./OutputWriter";
import {geneticSearch, ingredientsLikedMoreThanDisliked} from "./Strategies";
import {evaluate} from "./Evaluate";

const inputFileNames = [
    'a_an_example.in.txt',
    'b_basic.in.txt',
    'c_coarse.in.txt',
    'd_difficult.in.txt',
    'e_elaborate.in.txt'
]

for (let inputFileName of inputFileNames) {
    console.log(inputFileName);
    const input = new InputReader().read("./input/" + inputFileName);
    // logInput(inputFileName, input)
    const ingredients = geneticSearch(input);
    console.log(evaluate(input, ingredients));
    new OutputWriter().write("./output/" + inputFileName, ingredients);
}

function logInput(inputFileName: string, input: Input){
    console.log(inputFileName);
    console.log(JSON.stringify(input, null, 2));
}
