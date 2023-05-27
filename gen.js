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
        const filePath = path.join('./', jsonFile);

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
            const jsProgram = generateJSProgram(functions);

            // Write the JavaScript program to a file with the same name as the JSON file
            const outputFile = path.join('./', `${path.basename(jsonFile, '.json')}.js`);
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
function generateJSProgram(functions) {
    let jsProgram = '';

    // Iterate over each function
    for (const func of functions) {
        const { name, inputs, stateMutability } = func;

        // Generate the function signature
        const functionSignature = generateFunctionSignature(name, inputs);

        // Generate the function definition
        const functionDefinition = generateFunctionDefinition(functionSignature, stateMutability);

        // Append the function definition to the JavaScript program
        jsProgram += functionDefinition + '\n\n';
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
    return `${signature} {
    // Logic for the ${signature}
    // Call the Solidity function and handle the response
}`;
}
