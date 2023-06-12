const fs = require('fs');

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

module.exports = {
    createFile,
    writeToFile,
}