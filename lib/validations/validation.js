// Require filesystem utils
const fs = require('fs');

// Lodash is a general utils js lib
const _ = require('lodash');

// This lib helps to validate file mime types
const mime = require('mime');

// Error messages dictionary lib
const error_messages = require('./error_messages');

// Require global configuration constants
const CONF = require('../config/constants');


/** 
 * This class contains the validation regular expressions rules 
 * and also provides utility methods to validate the input of 
 * grid size, starting position and commands.
 * 
 * It is used by the Input class 
 * and works independently of the input mode (File or TTY)
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Validation {

    constructor(){
            
        // Reggex validation rules to parse robots instructions
        this._rules_regex = {

            // (e.g): 5 3
            grid_max_coordinates: /^\d{1,2}\s{1,2}\d$/mi,

            // (e.g): 1 1 E
            initial_positions: /^\d{1,2}\s\d{1,2}\s[NSEW]$/mi,

            // (e.g): FRRFLLFFRRFLL
            commands: /^[LRF]+$/mi
        }

        // Regex to trim unwanted trailing special chars
        this._trim_regex = {

            ltrim: /^(?:"|'|\s|\0)+/gi,

            rtrim: /(?:"|'|\s|\0)+$/gi,
        }
    }
    //-------------------------------------------------------------------------

    
    /**  
     *  Validates if the arguments input 
     *  is not empty or is not valid
     * 
     * @param  mixed value 
     * @returns string
     * @throws error
    */
    validateInputArgs(args_values) {

        // Checking if the path argument is present and is a string
        if (_.isEmpty(args_values) || _.isEmpty(args_values['f']) || _.isEmpty(args_values['file'])) throw new Error(error_messages.input_empty);
                    
        if (!_.isString(args_values['file'])) throw new Error(error_messages.invalid_input);

        let string_path = this.trimInput(args_values['file']);
        
        return string_path;
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * Validates if the input strings 
     * is a valid grid size coordinates 
     * validates string pattern
     * also validates coordinates are between grid max size constraints
     * 
     * @param  string string_input 
     * @returns array  representing x & y grid size
     
    */
    validateGridSizeInput(string_input) {

        //  Using regex to validate input grid size 
        if (!this._rules_regex.grid_max_coordinates.test(string_input)) throw new Error(`${error_messages.invalid_grid_size_input}: ${string_input}`);

        // Spliting max size coordinates
        let arr_grid_sizes = string_input.split(/\s/);
    
        // Check if the returning digits for X are between the limits
        if(!_.inRange(_.parseInt(arr_grid_sizes[0]), CONF.MIN_GRID_SIZE, CONF.MAX_GRID_SIZE+1))  throw new Error(`${error_messages.grid_size_out_of_range} (X): ${arr_grid_sizes[0]}`); 
        

        if(!_.inRange(_.parseInt(arr_grid_sizes[1]), CONF.MIN_GRID_SIZE, CONF.MAX_GRID_SIZE+1))  throw new Error(`${error_messages.grid_size_out_of_range} (Y): ${arr_grid_sizes[1]}`); 
        
        return arr_grid_sizes;
    }
    //-------------------------------------------------------------------------


    /**  
     * Validates if the bot position string 
     * is a valid position coordinates 
     * validates string pattern
     * also validates coordinates are between grid size constraints
     * 
     * @param  string string_input 
     * @returns object  representing x & y & orientation bot position & lost (boolean) 
     
    */
    validateBotInitialPosition(string_input, grid_size_x = 0, grid_size_y = 0) {

        //  Using regex to validate input grid size 
        if (!this._rules_regex.initial_positions.test(string_input)) throw new Error(`${error_messages.invalid_bot_position_input} - ${string_input}`);

        let lost = false;

        // Spliting the string
        let arr_bot_position = string_input.split(/\s/);

        // Check if the returning digits for X are between the Grid X size limits
        if(!_.inRange(_.parseInt(arr_bot_position[0]), CONF.MIN_GRID_SIZE,  grid_size_x+1))  lost = true;
        
        // Check if the returning digits for Y are between the Grid Y size limits
        if(!_.inRange(_.parseInt(arr_bot_position[1]), CONF.MIN_GRID_SIZE, grid_size_y+1))  lost = true;
        
        return { 

            initial_x: arr_bot_position[0],
            
            initial_y: arr_bot_position[1],
            
            orientation: arr_bot_position[2], 
            
            lost: lost
        };
    }
    //-------------------------------------------------------------------------


    /**  
     * Validates the bot commands string 
     * validates string pattern
     * also validates string size and truncate string to max_instruction_length
     * 
     * @param  string string_input 
     * @returns string  representing the commands
    */
    validateBotCommands(string_input) {

        //  Using regex to validate input grid size 
        if (!this._rules_regex.commands.test(string_input)) {

            // Remmove the robot position from the array
            this._instructions.initial_positions.pop();

            throw new Error(`${error_messages.invalid_bot_commands_input} - ${string_input}`);
        }
        
        // We only read the first max_instruction_length (100) chars from instruction line, 
        // the remaining chars will be ignored
        let commands = string_input.slice(0, CONF.MAX_COMMANDS_LENGTH);
        
        return commands;
    }
    //-------------------------------------------------------------------------


    
    /**  
     * Validates the input file  path 
     * checks if it is a valid text file
     * 
     * @param  string string_path 
     * @returns string
     * @throws error
    */   
    validateFilePath(string_path) {
    
        try {
            
            // First ask if the input path exists
            if (!fs.existsSync(string_path)) throw new Error(`${error_messages.file_not_exists} - input file path: ${string_path}`)
            
            // check if the path is readable
            fs.accessSync(string_path, fs.constants.R_OK);

            //  let's ask if the string path is a single file
            if(!fs.statSync(string_path).isFile()) throw new Error(error_messages.invalid_file_type);
                
            let mime_type = mime.getType(string_path);    

            if(_.isEmpty(mime_type) || !mime_type.includes('text/plain')) throw new Error(error_messages.invalid_file_type); 

            return string_path;

        } catch (error) { 

            if(error.message.includes("ENOENT")) throw new Error(`${error_messages.file_is_not_readable} - input file path: ${string_path}`);
            
            else throw error; 
        }
    } 
    //-------------------------------------------------------------------------
    
    
    /**  
     * get rid of unwanted trailing whitespaces, 
     * tabs, \n, \r, \0  and quotes '" 
     * 
     * @param  string string_input 
     * @returns string
     
    */
    trimInput(string_input){

        string_input = string_input.replace(this._trim_regex.ltrim,'');

        string_input = string_input.replace(this._trim_regex.rtrim,'');

        return string_input;
    }
    //-------------------------------------------------------------------------
};

module.exports = new Validation();