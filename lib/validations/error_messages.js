/** 
 * Application errors messages are defined here. 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
const error_messages = {
        
    input_empty: '001 - Input empty',

    invalid_input: '002 - Invalid input',

    invalid_option: '003 - Invalid option',
    
    file_not_exists: '004 - File does not exists',

    file_is_not_readable: '005 - File is not readable',

    invalid_file_type: '006 - Invalid file type, only text/plain files are supported',

    invalid_grid_size_input: '007 - Invalid grid size input',

    grid_size_out_of_range: '008 - The grid size is out of range',

    invalid_bot_position_input:'009 - Invalid bot position input',

    empty_bot_positions_input:'010 - Bot positions input are empty',

    invalid_bot_commands_input: '011 - Invalid robot commands input',
    
    empty_bot_commands_input:'012 - Bot input commands are empty',

    empty_output: '013 - No output object to show',

    invalid_instructions_setup: '014 - Invalid instructions setup',

    lost_robot:'LOST'
  
}

module.exports = error_messages;