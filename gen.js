const fs = require('fs');
const path = require('path');

// Read the directory
fs.readdir('.', (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    // Filter the files to include only JSON files
    const jsonFiles = files.filter((file) => path.extname(file) === '.json');

    // Process each JSON file
    jsonFiles.forEach((jsonFile) => {
        const filePath = path.join('.', jsonFile);

        // Read the JSON file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            try {
                // Parse the JSON data
                const functions = JSON.parse(data);

                // Generate the JavaScript program
                const jsProgram = generateJSProgram(functions, jsonFile);

                // Write the JavaScript program to a file with the same name as the JSON file
                const outputFile = path.join('.', `${path.basename(jsonFile, '.json')}.js`);
                fs.writeFile(outputFile, jsProgram, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    console.log(`JavaScript program generated successfully: ${outputFile}`);
                });
            } catch (err) {
                console.error(`Error parsing JSON in file: ${filePath}`, err);
            }
        });
    });
});

// Function to generate the JavaScript program
function generateJSProgram(functions, jsonFileName) {
    const jsHeader = `const Web3 = require("web3");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const web3 = new Web3(\`https://goerli.infura.io/v3/\${process.env.INFURA_KEY}\`);
const contractABI = JSON.parse(fs.readFileSync("${jsonFileName}"));
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);
const privateKey = '0x' + process.env.PRIVATE_KEY;

`;

    let jsProgram = jsHeader;

    // Iterate over each function
    for (const func of functions) {
        const { name, inputs, stateMutability } = func;

        if (Array.isArray(inputs) && inputs.length > 0) {
            // Generate the function signature
            const functionSignature = generateFunctionSignature(name, inputs);

            // Generate the function definition
            const functionDefinition = generateFunctionDefinition(functionSignature, stateMutability, inputs);

            // Append the function definition to the JavaScript program
            jsProgram += functionDefinition + '\n\n';
        }
    }

    // Add the module.exports statement
    jsProgram += 'module.exports = {\n';
    for (const func of functions) {
        const { name } = func;
        jsProgram += `    ${name},\n`;
    }
    jsProgram += '};';

    return jsProgram.trim();
}

// Function to generate the function signature
function generateFunctionSignature(name, inputs) {
    const inputParams = inputs.map((input) => input.name).join(', ');
    return `function ${name}(${inputParams})`;
}

// Function to generate the function definition
function generateFunctionDefinition(signature, stateMutability) {
    let functionDefinition = `${signature} {`;

    if (stateMutability === 'pure' || stateMutability === 'view') {
        const functionCall = `contract.methods.${signature.slice(9)}.call();`;
        functionDefinition += `
    // Call the Solidity function and handle the response
    ${functionCall}
}`;
    } else if (stateMutability === 'nonpayable') {
        const functionCall = `contract.methods.${signature.slice(9)}.send({ from: sender });;`;
        functionDefinition += `
    // Call the Solidity function and handle the response
    ${functionCall}
}`;
} else if (stateMutability === 'payable') {
    const functionCall = `contract.methods.${signature.slice(9)}.send({ from: sender, value: amount });`;
    functionDefinition += `
    // Call the Solidity function and handle the response
    ${functionCall}
}`;
    } else {
        functionDefinition += `
    // Logic for the ${signature}
    // Call the Solidity function and handle the response
}`;
    }

    return functionDefinition;
}
