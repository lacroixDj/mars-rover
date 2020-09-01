const fs = require('fs');

const path = require('path');

const assert = require('assert');

const { promisify } = require('util');

const readFile = promisify(fs.readFile);

const exec = promisify(require("child_process").exec);

const samples_dir = 'test/data';

const rn2n =  /\r\n/g;

const ltrim =  /^(?:"|'|\s|\0)+/i;

const rtrim =  /(?:"|'|\s|\0)+$/i;


// Test several inputs instructions sample data files
// The input will be validated against an output with the same file name.
// test/data/filename.input.txt == test/data/filename.output.txt. 
describe('Testing robots data in batch with input files', function () {
    
     
    const files = fs.readdirSync(samples_dir);
    
    const input_files = files.filter(filename => filename.endsWith('.input.txt'));


    for (const filename of input_files) {
        
        it(`All robots in each input file should match the expected output in its corresponding output file - ${filename}`, async () => {
            
            let input_file_path = path.join(samples_dir, filename);

            let output_file_path = input_file_path.replace('.input.txt', '.output.txt');

            let expected_output = await readFile(output_file_path, 'utf-8');

            expected_output = expected_output.replace(rn2n, '\n');

            expected_output = expected_output.replace(ltrim, '');

            expected_output = expected_output.replace(rtrim, '');

            let { stdout } = await exec(`node martian-robots -f ${input_file_path}`);

            stdout = stdout.replace(rn2n, '\n');

            stdout = stdout.replace(ltrim, '');

            stdout = stdout.replace(rtrim, '');

            assert.equal(stdout, expected_output);
        });
    }
});