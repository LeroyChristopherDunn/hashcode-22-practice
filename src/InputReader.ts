const fs = require('fs');

export type Input = {
    customers: Customer[]
}

export type Customer = {
    likes: string[]
    dislikes: string[]
}

export class InputReader{
    read(filePath: string): Input{
        const allFileContents = fs.readFileSync(filePath, 'utf-8');
        const lines: string[] = allFileContents.split(/\r?\n/);

        const customers: Customer[] = []

        const numClients = parseInt(lines[0]);
        for (let i = 1; i < lines.length; i+=2) {
            const likes: string[] = lines[i].split(' ').slice(1);
            const dislikes: string[] = lines[i+1].split(' ').slice(1);
            customers.push({likes, dislikes});
        }

        return {customers};
    }
}