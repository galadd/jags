const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const mock = require('mock-fs');
const assert = require('assert');
const { createFile, writeToFile, appendToFile, scanDirectory } = require('../src/fileOperation');

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
        it('should write content to an empty file', () => {
            const filename = 'test.txt';
            const content = 'content';

            // Create a dummy file
            fs.writeFileSync(filename, '');

            writeToFile(filename, content);

            // Assert that the file now contains content
            expect(fs.readFileSync(filename, 'utf8')).to.equal('content');
        });

        it('should overwrite content of an existing file', () => {
            const filename = 'test.txt';
            const content = 'new content';

            // Create a dummy file
            fs.writeFileSync(filename, 'initial content');

            writeToFile(filename, content);

            // Assert that the file now contains new content
            expect(fs.readFileSync(filename, 'utf8')).to.equal('new content');
        });

        it('should return an error message if the file does not exist', () => {
            const filename = 'nonexistent.txt';
            const content = 'new content';

            const result = writeToFile(filename, content);

            // Assert that an error message is returned
            expect(result).to.equal('Err: File does not exist');
        });
    });

    describe('appendToFile', () => {
        it('should append content to an existing file', () => {
            const filename = 'test.txt';
            const content = 'new content';

            // Create a dummy file
            fs.writeFileSync(filename, 'initial content');

            appendToFile(filename, content);

            // Assert that the file now contains both initial and new content
            expect(fs.readFileSync(filename, 'utf8')).to.equal('initial content\nnew content');
        });

        it('should return an error message if the file does not exist', () => {
            const filename = 'nonexistent.txt';
            const content = 'new content';

            const result = appendToFile(filename, content);

            // Assert that an error message is returned
            expect(result).to.equal('Err: File does not exist');
        });
    });

    // describe('readFile', () => {
    //     it('should read the contents of a file', async () => {
    //         fs.writeFileSync('sample.txt', 'Sample file content');

    //         const filePath = 'sample.txt';
    //         const expectedData = 'Sample file content';

    //         try {
    //         const data = await readFile(filePath, 'utf8');
    //             assert.strictEqual(data, expectedData);
    //         } catch (error) {
    //             assert.fail(`Error reading file: ${error}`);
    //         }
    //     });

    //     it('should throw an error if the file does not exist', async () => {
    //         const filePath = 'nonexistent/file.txt'; 

    //         try {
    //             await readFile(filePath, 'utf8');
    //             assert.fail('Expected an error to be thrown');
    //         } catch (error) {
    //             assert.strictEqual(error.code, 'ENOENT');
    //         }
    //     });
    // });
});

describe('Directory Scanner', () => {
    const testDirectory = path.join(__dirname, 'test-directory');

    before(() => {
        // Create a test directory structure
        fs.mkdirSync(testDirectory);
        fs.writeFileSync(path.join(testDirectory, 'file1.json'), '');
        fs.writeFileSync(path.join(testDirectory, 'file2.txt'), '');
        fs.mkdirSync(path.join(testDirectory, '.git'));
        fs.writeFileSync(path.join(testDirectory, '.git', 'file3.json'), '');
        fs.mkdirSync(path.join(testDirectory, 'node_modules'));
        fs.writeFileSync(path.join(testDirectory, 'node_modules', 'file4.json'), '');
        fs.mkdirSync(path.join(testDirectory, 'subdirectory'));
        fs.writeFileSync(path.join(testDirectory, 'subdirectory', 'file5.json'), '');
        fs.writeFileSync(path.join(testDirectory, 'subdirectory', 'file6.txt'), '');
    });

    after(() => {
        // Clean up the test directory
        fs.rmSync(testDirectory, { recursive: true });
    });

    it('should scan the directory and return only files with the specified extension', () => {
        const extension = '.json';
        const expectedFiles = [
        path.join(testDirectory, 'file1.json'),
        path.join(testDirectory, 'subdirectory', 'file5.json')
        ];

        const result = scanDirectory(testDirectory, extension);
        assert.deepStrictEqual(result, expectedFiles);
    });
});
