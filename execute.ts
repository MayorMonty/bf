export default class BrainFuckProgram {

    // Contains the program tokens
    tokens: string[] = [];
    currentInstruction: number = 0;
    stack: { pointer: number, instruction: number }[] = []

    tape: number[] = [];
    pointer: number = 0;

    constructor(tokens: string) {
        this.tokens = tokens.split("");
    }

    inputFlag: boolean = false;
    async step(input?: number): Promise<string> {

        // Get the current instruction
        const instruction = this.tokens[this.currentInstruction];
        let out: string = "";


        // Handle the token
        switch (instruction) {

            case ">": {
                this.pointer++;

                // If we move to a cell we haven't initalized before, instantiate it
                if (this.tape[this.pointer] === undefined) this.tape[this.pointer] = 0;
                break;
            }

            case "<": {
                this.pointer--;

                // Prevent array bound errors
                if (this.pointer < 0) {
                    this.pointer = 0;
                }

                // If we move to a cell we haven't initalized before, instantiate it
                if (this.tape[this.pointer] === undefined) this.tape[this.pointer] = 0;

                break;
            }

            case "+": {

                if (this.tape[this.pointer] === undefined) {
                    this.tape[this.pointer] = 0;
                }

                this.tape[this.pointer]++;

                // Loop around
                if (this.tape[this.pointer] > 255) {
                    this.tape[this.pointer] = 0;
                }

                break;
            }

            case "-": {


                if (this.tape[this.pointer] === undefined) {
                    this.tape[this.pointer] = 0;
                }

                this.tape[this.pointer]--;

                // Loop around
                if (this.tape[this.pointer] < 0) {
                    this.tape[this.pointer] = 255;
                }

                break;
            }

            case ".": {
                out += String.fromCharCode(this.tape[this.pointer]);
                break;
            }

            case ",": {
                this.tape[this.pointer] = input || this.tape[this.pointer];
                this.inputFlag = false;
                break;
            }

            case "[": {

                // If the current tape is zero the loop is skipped, otherwise stick another bracket on the stack
                // Note that this intrepreter assumes evenly matched brackets
                if (this.tape[this.pointer] !== 0) {
                    this.stack.push({ pointer: this.pointer, instruction: this.currentInstruction });
                } else {

                    // Find the next bracket to jump to
                    let depth = 1;
                    while (depth > 0) {
                        const char = this.tokens[++this.currentInstruction];
                        if (char == "[") depth++;
                        if (char == "]") depth--;
                    }


                }

                break;
            }

            case "]": {

                // If the condition is not met, jump back to the start of the bracket, otherwise pop the stack
                if (this.tape[this.pointer] === 0) {
                    this.stack.pop();
                } else {
                    this.currentInstruction = this.stack[this.stack.length - 1].instruction
                }


                break;
            }


        }

        // Increment the Instruction Pointer, and set any required flags
        this.currentInstruction++;

        // Input request flag
        if (this.tokens[this.currentInstruction] === ",") {
            this.inputFlag = true;
        }

        // Add any output in the step function
        return out;

    }

    finished() {
        return this.currentInstruction == this.tokens.length;
    }

}