// Require filesystem utils
const fs = require('fs');

// native process lib
const process = require('process');

// Requirie readline module, it helps to read line by line
const readline = require('readline');

// Lodash is a general utils js lib
const _ = require('lodash');

// Custom lib for print  ouput 
const output = require('./output');

// Minimist is a CLI arguments reader utils lib
const minimist = require('minimist');

// CLI argv parsing options
const argv_options = require('../config/argv_options');

// Instruuctions model class
const Instructions = require('../models/instructions');

// Validation utility class
const validation = require('../validations/validation');

// Error messages dictionary lib
const error_messages = require('../validations/error_messages');


/** 
 *  Input: this is a service class which parses, read user input 
 *  regardless of whether it is an input by TTY or by Input File
 * 
 *  It also deals with input validations
 *  relying on validation class
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
 */
class Input {

    constructor(){
        
        // Robot Instructions file path
        this._instructions_file_path = "";
        
        // The robots setup (grid size + initial positions + commands)
        this._instructions =  new Instructions({});
    }
    //-------------------------------------------------------------------------   

    
    /**  
     * Main function of this utility class. 
     * validates and parses CLI input arguments passed to the application 
     * by calling chained utility methods for checking
     * truthiness and correctness of received input paramerters.
     * 
     * @returns array with operands
     * @throws error  message to the console 
     
    */
    readInput(cli_loop) {

        try {
            
            // Read CLI arguments ommiting the first two (node and path to scriipt), and omiting miminimist default key '_'
            const args = _.omit(minimist(process.argv.slice(2), argv_options), '_');

            // Using TTY Console input
            if(_.isEmpty(args))  {

                cli_loop++;

                return this.readInputFromCLI(cli_loop)
            
                    .then( instructions_data => { return Promise.resolve({ instructions_data,  cli_loop })})  
                
                    .catch(error => { return Promise.reject(error) });
            
            } else if(!_.isNil(args['h'])) {

                    // prints help instructions
                    output.printHelpInstructions();

                    // exit gracefully
                    process.exit(0);
            
            } else {
                
                // disable cli_lopp in batch file mode
                cli_loop = 0;
                
                // Read input from file 
                return this.readInputFromFile(args)
                
                .then( instructions_data => { return Promise.resolve({ instructions_data, cli_loop })})
                
                .catch(error => { return Promise.reject(error) });
            } 

        } catch (error) {

            // Send the errors and break the chain
            return Promise.reject(error);
        }
    }
    //-------------------------------------------------------------------------

    
    /**  
     * This method controls the flow from read input instrctions from file
     *  It also calls file input validations methods.
     * 
     * @returns array with operands
     * @throws error  message to the console 
     
    */
    readInputFromCLI(cli_loop) {

        return new Promise(
            
            async (resolve, reject) => {
                
                try {

                    // Prints the app banner and instructions only the first time
                    if(cli_loop == 1) output.printHelpInstructions();

                    // Prints the input prompt indicator
                    output.printInputPromt();

                    // Lets clean the object DTO
                    this._instructions.clean();

                    let line_number = 0;
            
                    const rl = readline.createInterface({
        
                        input: process.stdin,
                
                        output: process.stdout,

                        terminal: false 
                    });
                    
                    // On close read stream then validate input data length and resolver
                    rl.on('close', () => {

                        if(!this._instructions.commands.length) throw new Error(error_messages.empty_bot_commands_input);
            
                        if(!this._instructions.initial_positions.length) throw new Error(error_messages.empty_bot_positions_input);

                        resolve(this._instructions);                
                    });


                    for await (const line of rl) {

                        // If the user input an empty line, stop the reading stream
                        if(!line) {

                            rl.close();

                            break;
                        }

                        let input_line = validation.trimInput(line);
                        
                        if(line_number == 0)  [this._instructions.grid_size_x, this._instructions.grid_size_y] = validation.validateGridSizeInput(input_line); 
                
                        else if (line_number % 2 != 0) {

                            let {position_x, position_y, orientation, lost} = validation.validateBotInitialPosition(input_line, this._instructions.grid_size_x, this._instructions.grid_size_y);
                    
                            this._instructions.initial_positions.push({position_x, position_y, orientation, lost});

                        } else if (line_number % 2 == 0)  {

                            let bot_commands = validation.validateBotCommands(input_line);

                            this._instructions.commands.push(bot_commands);
                        } 
                    
                        line_number++;
                    }

                } catch (error) {

                    return reject(error); 
                }
            }
        )
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * This method controls the flow from read input instrctions from file
     *  It also calls file input validations methods.
     * 
     * @returns array with operands
     * @throws error  message to the console 
     
    */
    readInputFromFile(args) {
        
        return this.getFileArgs(args)

        .then(string_path => this.getFilePath(string_path))

        .then(instructions_file => this.readInstructionsFromFile(instructions_file));

    }
    //-------------------------------------------------------------------------
    
    
    /**  
     *  Gets and validates  the arguments input 
     *  
     * @param  mixed value 
     * @returns promise
     * @throws error
    */
    getFileArgs(args_values) {

        return new Promise(
            
            (resolve, reject) => { 

            try {

                    let string_path = validation.validateFileArgs(args_values);

                    resolve(string_path);

                } catch (error) { 
                    
                    return reject(error); 
                } 
            }
        )
    }
    //-------------------------------------------------------------------------


    /**  
     *  Gets and validates the input file path 
     * 
     * @param  string string_path 
     * @returns promise
     * @throws error
    */   
    getFilePath(string_path) {
    
        return new Promise(
            
            (resolve, reject) => { 

            try {
                    
                    this._instructions_file_path = validation.validateFilePath(string_path);
                
                    resolve(this._instructions_file_path);

                } catch (error) { 

                    return reject(error); 
                }
            }  
        );
    } 
    //-------------------------------------------------------------------------

    
    /**  
     * This async function reads the input file line by line 
     * in secuential  mode, by creating a readable stream
     * it also validates and parse file instruction using
     * utiility regex methods 
     * 
     * @param  string arr_input 
     * @returns {promise} instructions_setup object     
    */
    readInstructionsFromFile(instructions_file){

        return new Promise(
            
            async (resolve, reject) => {
                
                try {

                    let line_number = 0;
            
                    const rl = readline.createInterface({
        
                        input: fs.createReadStream(instructions_file, {autoClose: true, emitClose: true}),
                
                        output: process.stdout,
                
                        crlfDelay: Infinity,

                        terminal: false 
                    });

                    for await (const line of rl) {

                        if(line_number==0)  [this._instructions.grid_size_x, this._instructions.grid_size_y] = validation.validateGridSizeInput(line); 
                
                        else if (line_number % 2 != 0) {

                            let {position_x, position_y, orientation, lost} = validation.validateBotInitialPosition(line, this._instructions.grid_size_x, this._instructions.grid_size_y);
                    
                            this._instructions.initial_positions.push({position_x, position_y, orientation, lost});

                        } else if (line_number % 2 == 0)  {

                            let bot_commands = validation.validateBotCommands(line);

                            this._instructions.commands.push(bot_commands);
                        } 
                    
                        line_number++;
                    }
            
                    if(!this._instructions.commands.length) throw new Error(error_messages.empty_bot_commands_input);
            
                    if(!this._instructions.initial_positions.length) throw new Error(error_messages.empty_bot_positions_input);

                    resolve(this._instructions);
                
                } catch (error) {

                    return reject(error); 
                }
            }
        )
    }
    //-------------------------------------------------------------------------
}
// End class.

module.exports = new Input();