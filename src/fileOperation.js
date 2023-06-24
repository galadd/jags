const fs = require('fs');
const path = require('path');

function createFile(filename) {
    if (!fs.existsSync(filename)) {
        // Create new file
        fs.writeFileSync(filename, '');
    }
}

function writeToFile(filename, content) {

    // Check if file exists
    if (fs.existsSync(filename)) {
        try {
            // Append content to existing  file
            fs.appendFileSync(filename, "\n" + content);
            return "Nil"
        } catch (err) {
            return err
        }
    } else {
        return "Err: File does not exist"
    }
}

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

        resolve(data);
        });
    });
}

function scanDirectory(directory, fileExtension) {
    const files = [];

    // Read the contents of the directory
    const directoryContents = fs.readdirSync(directory);

    // Iterate through each item in the directory
    for (const item of directoryContents) {
        const itemPath = path.join(directory, item);

        // Ignore directories named ".git" and "node_modules"
        if (
        fs.statSync(itemPath).isDirectory() &&
        (item === '.git' || item === 'node_modules')
        ) {
        continue;
        }

        // Check if the item has the desired file extension
        if (path.extname(itemPath) === fileExtension) {
        files.push(itemPath);
        }

        // Recursively scan subdirectories
        if (fs.statSync(itemPath).isDirectory()) {
        files.push(...scanDirectory(itemPath, fileExtension));
        }
    }

    return files;
}

module.exports = {
    createFile,
    writeToFile,
    readFile,
    scanDirectory
}