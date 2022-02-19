const fs = require('fs');

export type Ingredients = string[]

export class OutputWriter{
    write(filePath: string, ingredients: Ingredients){
        const outputString = [ingredients.length, ...ingredients].join(' ');
        fs.writeFile(filePath, outputString, function (err) {
            if (err) throw err;
        });
    }
}