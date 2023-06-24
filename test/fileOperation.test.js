const fs = require('fs');
const chai = require('chai');
const mock = require('mock-fs');
const { createFile, writeToFile } = require('../src/fileOperation');

const expect = chai.expect;

describe('File Operations', () => {

    before(() => {
        // Mock the file system
        mock();
    });

    after(() => {
        // Restore the original file system
        mock.restore();
    });

    describe('createFile', () => {
        it('should create a new file if it does not exist', () => {
        const filename = 'test.txt';

        createFile(filename);

        // Assert that the file exists
        expect(fs.existsSync(filename)).to.be.true;
    });

    it('should not create a new file if it already exists', () => {
        const filename = 'test.txt';

        // Create a dummy file
        fs.writeFileSync(filename, 'dummy content');

        createFile(filename);

        // Assert that the file still has the original content
        expect(fs.readFileSync(filename, 'utf8')).to.equal('dummy content');
    });
});

    describe('writeToFile', () => {
        it('should append content to an existing file', () => {
            const filename = 'test.txt';
            const content = 'new content';

            // Create a dummy file
            fs.writeFileSync(filename, 'initial content');

            writeToFile(filename, content);

            // Assert that the file now contains both initial and new content
            expect(fs.readFileSync(filename, 'utf8')).to.equal('initial content\nnew content');
        });

        it('should return an error message if the file does not exist', () => {
            const filename = 'nonexistent.txt';
            const content = 'new content';

            const result = writeToFile(filename, content);

            // Assert that an error message is returned
            expect(result).to.equal('Err: File does not exist');
        });
    });
});
