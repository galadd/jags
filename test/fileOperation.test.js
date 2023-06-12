const fs = require('fs');
const sinon = require('sinon');
const assert = require('assert');
const { createFile, writeToFile } = require('../src/fileOperation');

describe('File Operations', () => {

    describe('createFile', () => {

        it('should create a new file if it does not exist', () => {
            const filename = 'example.txt';

            // Mock the fs.existsSync method to return false
            sinon.stub(fs, 'existsSync').returns(false);

            // Spy on the fs.writeFileSync method
            const writeFileSyncSpy = sinon.spy(fs, 'writeFileSync');

            // Call the function being tested
            createFile(filename);

            // Verify that fs.writeFileSync is called with the correct arguments
            assert.strictEqual(writeFileSyncSpy.calledOnce, true);
            assert.strictEqual(writeFileSyncSpy.firstCall.args[0], filename);
            assert.strictEqual(writeFileSyncSpy.firstCall.args[1], '');

            // Restore the stub and spy
            fs.existsSync.restore();
            writeFileSyncSpy.restore();
        });
    });

        it('should not create a new file if it already exists', () => {
            const filename = 'example.txt';

            // Mock the fs.existsSync method to return true
            sinon.stub(fs, 'existsSync').returns(true);

            // Spy on the fs.writeFileSync method
            const writeFileSyncSpy = sinon.spy(fs, 'writeFileSync');

            // Call the function being tested
            createFile(filename);

            // Verify that fs.writeFileSync is not called
            assert.strictEqual(writeFileSyncSpy.called, false);

            // Restore the stub and spy
            fs.existsSync.restore();
            writeFileSyncSpy.restore();
        });

    describe('writeToFile', () => {
        
        it('should append content to an existing file', () => {
            const filename = 'example.txt';
            const content = 'Some content to append';
        
            // Mock the fs.existsSync method to return true
            sinon.stub(fs, 'existsSync').returns(true);
        
            // Spy on the fs.appendFileSync method
            const appendFileSyncSpy = sinon.spy(fs, 'appendFileSync');
        
            // Call the function being tested
            writeToFile(filename, content);
        
            // Verify that fs.appendFileSync is called with the correct arguments
            assert.strictEqual(appendFileSyncSpy.calledOnce, true);
            assert.strictEqual(appendFileSyncSpy.firstCall.args[0], filename);
            assert.strictEqual(appendFileSyncSpy.firstCall.args[1], "\n" + content);
        
            // Restore the stub and spy
            fs.existsSync.restore();
            appendFileSyncSpy.restore();
        });
        
        it('should return "Nil" when successful', () => {
            const filename = 'example.txt';
            const content = 'Some content to append';
        
            // Mock the fs.existsSync method to return true
            sinon.stub(fs, 'existsSync').returns(true);
        
            // Call the function being tested
            const result = writeToFile(filename, content);
        
            // Verify that the result is "Nil"
            assert.strictEqual(result, 'Nil');
        
            // Restore the stub
            fs.existsSync.restore();
        });
        
        it('should return an error message when the file does not exist', () => {
            const filename = 'nonexistent.txt';
            const content = 'Some content to append';
        
            // Mock the fs.existsSync method to return false
            sinon.stub(fs, 'existsSync').returns(false);
        
            // Call the function being tested
            const result = writeToFile(filename, content);
        
            // Verify that the result is the expected error message
            assert.strictEqual(result, 'Err: File does not exist');
        
            // Restore the stub
            fs.existsSync.restore();
        });
    });
});
