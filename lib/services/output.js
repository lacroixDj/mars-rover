// Lodash is a general utils js lib
const _ = require('lodash');

// Lib for colorizing output
const chalk = require('chalk');

// Require global configuration constants
const CONF = require('../config/constants');


// Error messages dictionary lib
const error_messages = require('../validations/error_messages');


/**
 * This class handles and centralizes aplication std output and std error 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Output {

        
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
            
            if (typeof(output) == 'string') 
            
                console.log(chalk.green(output));
            
            else if (Array.isArray(output)) 
            
                output.forEach( line => console.log(chalk.green(line)) );

            else if (typeof(output) == 'object') 
            
                console.log(chalk.green(JSON.stringify(output)));
            
            else 
            
                throw new Error(error_messages.invalid_output_type);

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

        if(CONF.ERROR_REPORTING) console.log(chalk.red(`ERROR: ${error.message}`));
        
        if(CONF.ERROR_REPORTING >=2 ) console.log(chalk.red(`Stack trace: ${error.stack}`));
    }
    //---------------------------------------------------------------------
}
// End class.

// Exporting the class instance
module.exports = new Output();