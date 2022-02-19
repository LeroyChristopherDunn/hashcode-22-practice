import {Input, InputReader} from "./InputReader";
import {OutputWriter} from "./OutputWriter";

const inputFileNames = ['a_an_example.in.txt']

for (let inputFileName of inputFileNames) {
    const input = new InputReader().read("./input/" + inputFileName);
    // logInput(inputFileName, input)
    new OutputWriter().write("./output/" + inputFileName, ["example", "output", "ingredients"]);
}

function logInput(inputFileName: string, input: Input){
    console.log(inputFileName);
    console.log(JSON.stringify(input, null, 2));
}
