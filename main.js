// Custom lib for handling input options / vavlues
const input = require('./lib/services/input');

// Custom lib for handling / print app ouput and errors
const output = require('./lib/services/output');

// Custom lib for handling app robots logic
const controller = require('./lib/services/controller');

/**
 * Starting point of the javascript program, 
 * it has the main application logic flow by invoking 
 * utility classes located in  src/ 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
 */
const main = () => {
    
    input.readInput()

        .then( instructions_data => controller.setUpAndRun(instructions_data))

        .then( robots_output => output.printOutput(robots_output))
        
        .catch(error => output.printError(error));
}

// Exporting the class instance
module.exports = main;