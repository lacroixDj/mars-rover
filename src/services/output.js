// Lodash is a general utils js lib
const _ = require('lodash');

// Lib for colorizing output
const chalk = require('chalk');

// Libs for fan
var figlet = require('figlet');

// Require global configuration constants
const CONF = require('../config/constants');

// Error messages dictionary lib
const error_messages = require('../validations/error_messages');

// Help messages 
const { app_ascii_banner, help_message, input_prompt_message } = require('../validations/help_messages');

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
    printOutput({ robots_output, cli_loop }) {

        try {

            if (_.isEmpty(robots_output))  throw new Error(error_messages.empty_output); 
            
            if (typeof(robots_output) == 'string') 
            
                console.log(chalk.green(robots_output));
            
            else if (Array.isArray(robots_output)) 
            
                robots_output.forEach( line => console.log(chalk.green(line)));

            else throw new Error(error_messages.invalid_output_type);

            return Promise.resolve(cli_loop);
                            
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


    /**  
     * 
     * Prints usage / help instructions message 
     * 
    */    
    printHelpInstructions(){
        console.log(chalk.yellow('________________________________________________________________________________'))
        console.log(chalk.yellow(figlet.textSync(app_ascii_banner, {font: 'Slant',  width: 80 })));
        console.log(chalk.blue(help_message));
    }
    //-------------------------------------------------------------------------


    /**  
     * 
     * Prints imput prompt message indicator
     * 
    */    
    printInputPromt(){
        console.log(chalk.black.bgYellow(input_prompt_message));
    }
    //-------------------------------------------------------------------------




}
// End class.

// Exporting the class instance
module.exports = new Output();