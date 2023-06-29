const fs = require("fs");
const path = require("path");
const { createFile, writeToFile, scanDirectory } = require('../src/fileOperation');

// Read the directory
const jags = async (directoryPath) => {
  
  // Get the JSON files within the directory
  const jsonFiles = scanDirectory(directoryPath, '.json');

  // Process each JSON file
  jsonFiles.forEach((jsonFile) => {

    // Read the JSON file
    fs.readFile(jsonFile, 'utf8', (err, dat) => {
      if (err) {
        console.error(err);
        return;
      }

      try {
        let functions;
        // Parse the JSON data
        let data = JSON.parse(dat);
        // Try to get the abi from the file
        if (Array.isArray(data)) {
          functions = data;
        } else if (typeof data === 'object') {
          if (data.bytecode !== undefined && data.bytecode.length < 3) {
            return;
          }
          if (Array.isArray(data.abi)) {
            functions = data.abi;
          } else {
            const values = Object.values(data);
            values.forEach((value) => {
              if (Array.isArray(value) && value.length > 3) {
                functions = value;
              }
            });
          }
        }
        // Return if we don't have an array
        if (!Array.isArray(functions)) {
          return;
        }

        // Generate the JavaScript program
        const jsProgram = generateJSProgram(functions, jsonFile);

        // Write the JavaScript program to a file with the same name as the JSON file
        const outputFile = path.join('.', `${path.basename(jsonFile, '.json')}.js`);
        createFile(outputFile)
        const err = writeToFile(outputFile, jsProgram)
        if (err == 'Nil') {
          console.log(`JavaScript program generated successfully: ${outputFile}`);
        }
      } catch (err) {
        console.error(`Error parsing JSON in file: ${filePath}`, err);
      }
    });
  });
};


// Function to generate the JavaScript program
function generateJSProgram(functions, jsonFileName) {
  try {
    const jsHeader = `const Web3 = require("web3");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const networkUrl = process.env.NETWORK_URL; // Set the network URL as an environment variable
const web3 = new Web3(networkUrl);
const contractABI = JSON.parse(fs.readFileSync("${jsonFileName}"));
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);
const privateKey = '0x' + process.env.PRIVATE_KEY;

`;

    let jsProgram = jsHeader;

    // Iterate over each function
    for (const func of functions) {
      if (func.type === "function")

      if (Array.isArray(func.inputs) && (func.inputs).length >= 0) {
        // Generate the function signature
        const functionSignature = generateFunctionSignature(func.name, func.inputs);

        // Generate the function definition
        const functionDefinition = generateFunctionDefinition(
          functionSignature,
          func.stateMutability,
          func.inputs
        );

        // Append the function definition to the JavaScript program
        jsProgram += functionDefinition + "\n\n";
      }
    }

    // Add the module.exports statement
    jsProgram += "module.exports = {\n";
    for (const func of functions) {
      if (func.type === "function")
      jsProgram += `    ${func.name},\n`;
    }
    jsProgram += "};";

    return jsProgram.trim();
  } catch (err) {
    console.log("file not supported or incorrect abi format");
  }
}

// Function to generate the function signature
function generateFunctionSignature(name, inputs) {
  const inputParams = inputs.map((input) => input.name).join(", ");
  return `function ${name}(${inputParams})`;
}

// Function to generate the function definition
function generateFunctionDefinition(signature, stateMutability) {
  let functionDefinition = `${signature} {`;

  if (stateMutability === "pure" || stateMutability === "view") {
    const functionCall = `return contract.methods.${signature.slice(
      9
    )}.call();`;
    functionDefinition += `
    // Call the Solidity function and handle the response
    ${functionCall}
}`;
  } else if (stateMutability === "nonpayable") {
    const functionCall = `contract.methods.${signature.slice(
      9
    )}.send({ from: sender });`;
    functionDefinition += `
    // Call the Solidity function and handle the response
    ${functionCall}
}`;
  } else if (stateMutability === "payable") {
    const functionCall = `contract.methods.${signature.slice(
      9
    )}.send({ from: sender, value: amount });`;
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

module.exports = {
  generateJSProgram,
  generateFunctionDefinition,
  generateFunctionSignature,
}

const directoryPath = process.argv[2]; // Access the command-line argument for the directory
jags(directoryPath);
