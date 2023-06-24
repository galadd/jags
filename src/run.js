const jags = require("./gen");

const directoryPath = process.argv[2]; // Access the command-line argument for the directory
jags(directoryPath);
