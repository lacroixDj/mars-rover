// Lodash is a general utils js lib
const _ = require('lodash');

// Lib for colorizing output
const chalk = require('chalk');

// Error messages dictionary lib
const error_messages = require('../validations/error_messages');


/**
 * This class handles and centralizes aplication std output and std error 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Output {

    
    constructor() {

        this._output = "";

        this._error_found = false;
    }

    
    /**  
     * Prints the output to de console
     * 
     * Centralizes the std output
     *  
     * @param   {object}  output object 
     * @returns {Promise} Resolve the promise if everything is ok, otherwise rejects
    */    
    printOutput(output) {

        try {

            if (_.isEmpty(output))  throw new Error(error_messages.empty_output); 
            
            this._output = JSON.stringify(output);

            console.log(chalk.green(this._output));

            return Promise.resolve(this._output);
                            
        } catch (error) {

            return Promise.reject(error);
        }
    }  
    //---------------------------------------------------------------------
    
    
    /**  
     * Prints errors to the console
     * 
     * Centralizes the error output, all application errors are piped to here 
     *  
     * @param   {array}  errors statck 
     * 
    */
    printError(error) {

        console.log(chalk.red(`ERROR: ${error.message}`));
        console.log(chalk.red(`Stack trace: ${error.stack}`));
    }
    //---------------------------------------------------------------------
}
// End class.

// Exporting the class instance
module.exports = new Output();