// Custom lib for handling input options / vavlues
const input = require('./services/input');

// Custom lib for handling / print app ouput and errors
const output = require('./services/output');

// Custom lib for handling app robots logic
const controller = require('./services/controller');

/**
 * Starting point of the javascript program, 
 * it has the main application logic flow by invoking 
 * utility classes located in  src/ 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
 */
const main = () => {
    
    const run = (cli_loop = 0) => { 
       
        input.readInput(cli_loop)

            .then(({ instructions_data, cli_loop }) => controller.setUpAndRun({ instructions_data, cli_loop }))

            .then(({ robots_output, cli_loop }) => output.printOutput({ robots_output, cli_loop }))

            .then( cli_loop => { if( cli_loop > 0 ) run(cli_loop) })
        
            .catch(error => output.printError(error))
    }

    run();
}

// Exporting the class instance
module.exports = main;