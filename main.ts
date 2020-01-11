/**
 * BrainFuck interpreter
 */

import BrainFuckProgram from "./execute"

const text = `+[-[<<[+[--->]-[<<<]]]>>>-]>-.---.>..>.<<<<-.<+.>>>>>.>.<<.<-.`
const program = new BrainFuckProgram(text);

async function timeout(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

async function getInput() {
    process.stdout.write("\n> ");

    return new Promise<string>(r => {
        let callback = (data: any) => {
            r(data.toString());
            process.stdout.off("data", callback)
        }
        process.stdout.on("data", callback);

    })
}

// Top level await can't come soon enough
async function main() {

    let stdout = "";
    let stdin = 0;

    while (!program.finished()) {


        let out = await program.step(stdin);
        process.stdout.write(out);

        console.log(`${program.tape.map((v, i) => i == program.pointer ? `[${v}]` : ` ${v} `).join(" ")}`);
        console.log(`${text}`);
        console.log(" ".repeat(program.currentInstruction) + "^");
        console.log(out + "\n");

        await timeout(50);

        stdout += out;

        if (program.inputFlag) {
            stdin = (await getInput()).charCodeAt(0);
        }



    }

    console.log(stdout);
}

main();