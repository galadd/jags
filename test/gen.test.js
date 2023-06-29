const assert = require("assert");
const { expect } = require('chai');
const path = require("path");
const fs = require("fs");
const { generateFunctionSignature, generateFunctionDefinition, generateJSProgram } = require("../src/gen");

describe("JAGS test preview", () => {
  it("should print jags test preview", () => {
    const end = "jags test preview";
    let combo = "jags" + " test preview";
    assert.strictEqual(end, combo);
  });
});

describe("Generate JS Program", () => {

  describe("Function structure - signature", () => {

    it("successfully generates a function signature", () => {

      const name = "create"
      const inputs = [
        { internalType: 'string', name: '_title', type: 'string' },
        { internalType: 'string', name: '_description', type: 'string' },
        { internalType: 'string', name: '_uri', type: 'string' }
      ]

      const expectedSign = "function create(_title, _description, _uri)"

      const signature = generateFunctionSignature(name, inputs)

      expect(expectedSign).to.equal(signature)

    });
  });

  describe("Function structure - definition", () => {

    it("should correctly generate the function signature when state mutability is pure ", () => {

      const signature = "function add(_initial, _final)"
      const stateMutability = "pure"

      const expectedDef = `function add(_initial, _final) {
    // Call the Solidity function and handle the response
    return contract.methods.add(_initial, _final).call();
}`

      const definition = generateFunctionDefinition(signature, stateMutability)

      expect(expectedDef).to.equal(definition)
    });

    it("should correctly generate the function signature when state mutability is view ", () => {

      const signature = "function add(_initial, _final)"
      const stateMutability = "view"

      const expectedDef = `function add(_initial, _final) {
    // Call the Solidity function and handle the response
    return contract.methods.add(_initial, _final).call();
}`

      const definition = generateFunctionDefinition(signature, stateMutability)

      expect(expectedDef).to.equal(definition)
    });

    it("should correctly generate the function signature when state mutability is nonpayable ", () => {

      const signature = "function add(_initial, _final)"
      const stateMutability = "nonpayable"

      const expectedDef = `function add(_initial, _final) {
    // Call the Solidity function and handle the response
    contract.methods.add(_initial, _final).send({ from: sender });
}`

      const definition = generateFunctionDefinition(signature, stateMutability)

      expect(expectedDef).to.equal(definition)
    });

    it("should correctly generate the function signature when state mutability is payable ", () => {

      const signature = "function add(_initial, _final)"
      const stateMutability = "payable"

      const expectedDef = `function add(_initial, _final) {
    // Call the Solidity function and handle the response
    contract.methods.add(_initial, _final).send({ from: sender, value: amount });
}`

      const definition = generateFunctionDefinition(signature, stateMutability)

      expect(expectedDef).to.equal(definition)
    });
  });

  describe("Generate SDK", () => {

    it("should not generate the function when state type is constructor ", () => {

      const func = [
        { inputs: [], 
          stateMutability: 'nonpayable', 
          type: 'constructor' 
        },
        {
          "inputs": [],
          "name": "getOwner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
      const name = "owner.json"

      // the stateMutability of the constructor is non-payable
      // and non-payable has `.send({ from: sender })` in function logic

      // check that `.send({ from: sender })` doesn't exist in the generated program
      

      const generated = generateJSProgram(func, name)

      assert(!generated.includes(".send({ from: sender })"))
    });

    it("should not generate the function when state type is event ", () => {

      const func = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "oldOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnerSet",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "getOwner",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ]
      const name = "owner.json"

      // the name of the event is OwnerSet

      // check that `OwnerSet` doesn't exist in the generated program
      

      const generated = generateJSProgram(func, name)

      assert(!generated.includes("OwnerSet"))
    });

    it("should succesfully generate a full sdk program", () => {
      const functions = [
        {
          inputs: [ [Object] ],
          name: 'buyProduct',
          outputs: [],
          stateMutability: 'payable',
          type: 'function'
        },
        {
          inputs: [ [Object] ],
          name: 'deleteProduct',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          inputs: [],
          name: 'getProductsLength',
          outputs: [ [Object] ],
          stateMutability: 'view',
          type: 'function'
        }
      ]
      const jsonFileName = "/Users/administrator/MyContract/abi/Contract.json"

      const header = `const Web3 = require("web3");
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

      const expected = `${header}function buyProduct() {
    // Call the Solidity function and handle the response
    contract.methods.buyProduct().send({ from: sender, value: amount });
}

function deleteProduct() {
    // Call the Solidity function and handle the response
    contract.methods.deleteProduct().send({ from: sender });
}

function getProductsLength() {
    // Call the Solidity function and handle the response
    return contract.methods.getProductsLength().call();
}

module.exports = {
    buyProduct,
    deleteProduct,
    getProductsLength,
};`

      const generated = generateJSProgram(functions, jsonFileName)

      expect(expected).to.equal(generated)
    });
  });
});