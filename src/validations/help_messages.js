// Require global configuration constants
const CONF = require('../config/constants');

/** 
 * Application instructions messages are defined here. 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/


// App ASCII banner
const app_ascii_banner = `
        martian
       robots >> 
`;
//-------------------------------------------------------------------------------


// Input prompt message
const input_prompt_message = `Input >>`
//-------------------------------------------------------------------------------


// App help instructions
const help_message = `
_____________________ [ MARTIAN-ROBOTS CLI INSTRUCTIONS ] ______________________

1. - First line should be Mars surface grid size expresed in X Y (upper-right)
     coordinates. The remaining input lines consists of a sequence of robots 
     positions and instructions (two lines per robot, many robots you want). 

2. - Second line represents the robot initial position, consists of two integers
     specifying the initial coordinates X Y of the robot and its orientation 
     (${CONF.NORTH.LABEL}, ${CONF.SOUTH.LABEL}, ${CONF.EAST.LABEL}, ${CONF.WEST.LABEL}), separated by whitespace in the same line.  

3. - Third line  represents the robot instruction is a string of the letters
     ${CONF.ROTATE_LEFT}, ${CONF.ROTATE_RIGHT}, and ${CONF.FORWARD.LABEL} on one line.

4. - Enter a blank line to process input.

5. - The maximum allowed value for any coordinate is ${CONF.MAX_GRID_SIZE}

6. - All instruction strings should be less than ${CONF.MAX_COMMANDS_LENGTH} characters in length

7. - You can also run this program in batch mode by passing the argument 
     -f | --file - Example: ./martian-robots -f /path/to/input/file.txt

8. - Pass -h | --help argument to show this help.
    
9. -  Enter <ctrl + C> to exit.

Author: <lacroixDj@gmail.com>
________________________________________________________________________________`;
//-------------------------------------------------------------------------------        

module.exports = {app_ascii_banner, help_message, input_prompt_message};