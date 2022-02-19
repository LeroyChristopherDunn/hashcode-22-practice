import {Ingredients} from "./OutputWriter";
import {evaluate} from "./Evaluate";
import {Input} from "./InputReader";

type IngredientSet = Set<string>;

class CandidateResult{

    key: string;

    constructor(
        readonly candidate: IngredientSet,
        readonly score: number,
    ) {
        this.key = Array.from(candidate).toString();
    }
}

const NUM_TOP_CANDIDATES = 10;

export class GeneticAlg{

    private readonly mutator: Mutator;
    private readonly results: CandidateResults;

    constructor(
        private readonly input: Input,
        private readonly allLikedIngredientsList: Ingredients,
        private readonly allDislikedIngredientsList: Ingredients,
    ) {
        this.mutator = new Mutator(allLikedIngredientsList, allDislikedIngredientsList);
        this.results = new CandidateResults(NUM_TOP_CANDIDATES);

        const startingCandidate = allLikedIngredientsList.slice(0, allLikedIngredientsList.length/2);
        const startingCandidateScore = evaluate(input, startingCandidate);
        this.results.put(new CandidateResult(new Set(startingCandidate), startingCandidateScore));
    }

    run(numGenerations = 10): Ingredients{
        for (let i = 0; i < numGenerations; i++) {
            const results =  this.results.getTopCandidates()
                .flatMap(topCandidate => this.getMutations(topCandidate))
                .map(candidate => {
                    const score = evaluate(this.input, candidate);
                    return new CandidateResult(candidate, score);
                });
            this.results.put(...results);

            console.log('generation ' + i);
            // console.log(this.results.getTopCandidates())
            console.log(evaluate(this.input, this.results.getTopCandidates()[0]))
        }
        const topIngredient = this.results.getTopCandidates()[0];
        return Array.from(topIngredient);
    }

    private getMutations(candidate: IngredientSet){
        return [
            this.mutator.addLikedIngredient(candidate),
            this.mutator.addLikedIngredient(candidate),
            this.mutator.removeDislikedIngredient(candidate),
            this.mutator.removeDislikedIngredient(candidate),
            this.mutator.replaceOneIngredient(candidate),
            this.mutator.replaceOneIngredient(candidate),
            this.mutator.replaceTwoIngredients(candidate),
            this.mutator.replaceTwoIngredients(candidate),
        ].filter(candidate => candidate)
    }
}

export class CandidateResults{

    private results: CandidateResult[] = [];

    constructor(private readonly numTopCandidates = 1) {}

    put(...results: CandidateResult[]){
        const updatedResults = [...this.results, ...results];

        const keys = updatedResults.map(result => result.key)
        const uniqueKeys = Array.from(new Set(keys));

        this.results = uniqueKeys
            .map(key => updatedResults.find(result => result.key === key))
            .sort((a, b) => -(a.score - b.score)) //sort highest to lowest
            .slice(0, this.numTopCandidates);
    }

    getTopCandidates(): IngredientSet[]{
        return this.results.map(result => result.candidate);
    }
}

export class Mutator{

    private readonly maxRandomTries = 1000;

    constructor(
        private readonly allLikedIngredientsList: Ingredients,
        private readonly allDislikedIngredientsList: Ingredients,
    ) {}

    private getRandomLikedIngredientNotInCandidate(candidate: IngredientSet): string | null {
        let i = 0;
        while (i < this.maxRandomTries){
            i++;
            const randomIndex = Math.round(Math.random() * (this.allLikedIngredientsList.length - 1));
            const randomIngredient = this.allLikedIngredientsList[randomIndex];
            if (!candidate.has(randomIngredient)) return randomIngredient;
        }
        return null;
    }

    addLikedIngredient(candidate: IngredientSet): IngredientSet | null{
        if (candidate.size >= this.allLikedIngredientsList.length) return null;
        const randomIngredient = this.getRandomLikedIngredientNotInCandidate(candidate);
        if (!randomIngredient) return null;
        return new Set([...Array.from(candidate), randomIngredient]); // expensive
    }

    private getRandomDislikedIngredientInCandidate(candidate: IngredientSet): string | null{
        let i = 0;
        while (i < this.maxRandomTries){
            i++;
            const randomIndex = Math.round(Math.random() * (this.allDislikedIngredientsList.length - 1));
            const randomIngredient = this.allDislikedIngredientsList[randomIndex];
            if (candidate.has(randomIngredient)) return randomIngredient;
        }
        return null;
    }

    removeDislikedIngredient(candidate: IngredientSet): IngredientSet | null{
        if (!candidate.size) return null;
        const randomIngredient = this.getRandomDislikedIngredientInCandidate(candidate);
        if (!randomIngredient) return null;
        return new Set([...Array.from(candidate).filter(ingredient => ingredient !== randomIngredient)]); // expensive
    }

    replaceOneIngredient(candidate: IngredientSet): IngredientSet | null{
        const removed = this.removeDislikedIngredient(candidate);
        if (!removed) return null;
        return this.addLikedIngredient(removed);
    }

    replaceTwoIngredients(candidate: IngredientSet): IngredientSet | null{
        const replaced = this.replaceOneIngredient(candidate);
        if (!replaced) return null;
        return this.replaceOneIngredient(replaced);
    }
}
