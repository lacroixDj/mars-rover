// Lodash is a general utils js lib
const _ = require('lodash');

// Universal unique id utility lib
const { v4: uuidv4 } = require('uuid');

// Require global configuration constants
const CONF = require('../config/constants');

// Grid model 
const Grid = require('./grid');

// Error messages dictionary lib
const error_messages = require('../validations/error_messages');


/** 
 * This class represent a model for a Robot
 * it holds the attributes and its methods.
 * 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Robot {

    constructor({ position_x, position_y, orientation, lost }){
            
        // Robot unique indentifier (this maybe will be useful in the future)
        // (perhaps to differentiate robots from each other, or allow  to get a robot by id)
        this._id = uuidv4();
        
        // Robot position X 
        this._position_x = parseInt(position_x) || 0;
    
        // Robot position X 
        this._position_y = parseInt(position_y) || 0;
        
        // Initialize orientation empty object
        this._orientation = {}
        
        // Mutator method to set orientation attribute
        this.setOrientation(orientation);
        
        // Boolean that represents whether the robot is lost or not
        this._lost = lost || false;

        // String commands
        this._commands = '';
    }
    //-------------------------------------------------------------------------
        
    
    /**  
     * This method its a mutator setter for the orientation attribute 
     * 
     * It gets the corresponding Map entry from CARDINAL_POINTS
     * 
    */
    setOrientation(param) {

        // lets lookUp our value in CARDINAL_POINTS Map, in case of failure it will fallback to NORTH
        this._orientation = CONF.CARDINAL_POINTS.get(param) || CONF.NORTH;
    }
    //-------------------------------------------------------------------------


    /**  
     * 
     * Setter for Robot str commands attribute
     * 
    */
    setCommands(str_commands) {
        this._commands = str_commands || '';
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * Rotates to left the robot orientation in counter-clockwise direcrion
     *  
     * 1,2,4,8...1,2,4,8...1  =  N,W,S,E...N,W,S,E...N 
     * 
     * (The inverse of rotateRight())
     * 
     * This is achieved by using circular bit rotations (circular shift) 
     * which is a special kind of cyclic permutation by shifting bits to the next left position 
     * while moving the leftmost bit to the first (rightmost) position
     * 
     */    
    rotateLeft() {
        
        let int_orientation = CONF.BITS_INTEGER_MASK & ((this._orientation.VALUE << CONF.ROTATE_ONCE) | (this._orientation.VALUE >>> (CONF.BITS_INTEGER_LENGTH - CONF.ROTATE_ONCE)));
        
        this.setOrientation(int_orientation);
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * Rotates to right the robot orientation in clockwise direcrion 
     * 1,8,4,2...1,8,4,2...1  =  N,E,S,W...N,E,S,W...N  
     * 
     * (The inverse of rotateLeft())
     * 
     * This is achieved by using circular bit rotations (circular shift) 
     * which is a special kind of cyclic permutation by shifting bits to the next right position 
     * while moving the last (rightmost) bit to the first (leftmost ) position
     *  
    */ 
    rotateRight() {

        let int_orientation = CONF.BITS_INTEGER_MASK & ((this._orientation.VALUE << (CONF.BITS_INTEGER_LENGTH - CONF.ROTATE_ONCE)) | (this._orientation.VALUE >>> CONF.ROTATE_ONCE));

        this.setOrientation(int_orientation);
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * 
     * Move forward shorthand / wrapper method
     * it uses the underlaying move() method 
     * 
     * @return {object}  
    */
    moveForward() {
        return this.move(CONF.FORWARD.LABEL);
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * 
     * Move backward shorthand / wrapper method
     * it uses the underlaying move() method 
     * 
     * @return {object}  
    */
    moveBackward() {
        return this.move(CONF.BACKWARD.LABEL);
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * 
     * Move leftward shorthand / wrapper method
     * it use the underlaying move() method 
     * 
     * @return {object}  
    */
    moveLeftward() {
        return this.move(CONF.LEFTWARD.LABEL);
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * 
     * Move leftward shorthand / wrapper method
     * it use the underlaying move() method 
     * 
     * @return {object}  
    */
    moveRightward() {
        return this.move(CONF.RIGHTWARD.LABEL);
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * 
     * Move the robot on the grid surface
     * depending on the  robot current orientation
     * and the movement_direction type  
     * 
     * @return {object}  
    */
    move(movement_direction) {
        
        let position_x = 0;
        
        let position_y = 0;

        // Lest get movement directions (forward, backwad)
        const { forward_backward , leftward_rightward } = this.getMovementDirection(movement_direction);

        switch (this._orientation.LABEL) {
        
            case CONF.NORTH.LABEL:
                position_x = this._position_x + leftward_rightward;
                position_y = this._position_y + forward_backward;
            break;

            case CONF.WEST.LABEL:
                position_x = this._position_x - forward_backward;
                position_y = this._position_y + leftward_rightward;
            break;

            case CONF.SOUTH.LABEL:
                position_x = this._position_x - leftward_rightward
                position_y = this._position_y - forward_backward;
            break;

            case CONF.EAST.LABEL:
                position_x = this._position_x + forward_backward;
                position_y = this._position_y - leftward_rightward;
            break;
        }
        
        return {position_x, position_y}
    }
    //-------------------------------------------------------------------------


    /**  
     * 
     * Determine the the type forward / backwards 
     * left or right depending on the movement_direction param
     * 
     *  @return {object}  
    */    
    getMovementDirection(direction) {

        let forward_backward = 0;
        
        let leftward_rightward = 0;

        switch (direction) {
            
            case CONF.FORWARD.LABEL: forward_backward = CONF.FORWARD.VALUE;  break;

            case CONF.BACKWARD.LABEL: forward_backward = CONF.BACKWARD.VALUE; break;
            
            case CONF.RIGHTWARD.LABEL: leftward_rightward = CONF.RIGHTWARD.VALUE; break;
        
            case CONF.LEFTWARD.LABEL: leftward_rightward = CONF.LEFTWARD.VALUE; break;
        }

        return { forward_backward , leftward_rightward }
    }
    //-------------------------------------------------------------------------


    /**  
     * 
     * Determine if the Robot is lost 
     * whether by lost flag, or by robot current positon
     * 
     * or by 'ghost' postion provided by optional params
     * this helps to determine if the robot will be lost with given
     * position before change (persists) its actual position
     * 
     *  @return {object}  
    */
    checkIfLost(limit_x, limit_y, position_x, position_y) {
        
        if (this._lost) return this._lost; // the lost flag was true
        
        let lost_in_x = position_x < 0  || position_x > limit_x;

        let lost_in_y = position_y < 0  || position_y > limit_y;

        return (lost_in_x || lost_in_y);
    }
    //-------------------------------------------------------------------------

    
    /**  
     * 
     * Set lost boolean flag
     *   
    */
    setLost(value) {

        this._lost = Boolean(value);
    }
    //-------------------------------------------------------------------------


    /**  
     * This is a setter method for robot position,
     * used to "persist" the updated position 
     * to the Robot instance
     *  
    */
    setPosition(position_x, position_y) {

        this._position_x = position_x;

        this._position_y = position_y;
    }
    //-------------------------------------------------------------------------


    /**
     * This method executes the robot's "automatic pilot" mode 
     * by executing each of the commands in this._commands string attribute, 
     * It calls  runCommand() individually for each command found.  
     * 
     * It also determines if the robot should ignore the command due 
     * to having found a "scent or lost flag" in the grid. 
     * 
     * Finally check the "ghost position" then persists the robot's 
     * final position by calling setPosition() or set lost attribute
     * by calling setLost() if the robot is lost 
     *  
     * @param {Grid} grid  the grid object where the robot is placed on
     * @throws {Error}  
    */
    runAutopilot(grid){

        if(_.isEmpty(this._commands)) throw new Error(error_messages.empty_bot_commands_input);

        if(_.isEmpty(grid) || !(grid instanceof Grid) ) throw new Error(error_messages.invalid_grid_param); 

        // Border case: It could be possible that the robot its already lost with its given initial position
        if (this.checkIfLost(grid.size_x, grid.size_y, this._position_x, this._position_y)) {
            
            // let's set the lost attribute
            this.setLost(true);

            // If so... lets flag the position with the "scent" lost flag 
            grid.markLostPoint(this._position_x, this._position_y);

            // lets return, Run commands on lost robots has no effects
            return;
        }
        
        let arr_commands = this._commands.split('');
        
        for (let i = 0; i < arr_commands.length; i++) {

            // This flag could be changed in a previous iteration
            if(this._lost) return;

            let ghost = this.runCommand(arr_commands[i]);
            
                

            // Check if a previous robot has market its "scent" in this current point
            let isLostPoint = grid.checkIfLostPoint(this._position_x, this._position_y);

            // Check if in this movement the robot will be lost
            let willBelost = this.checkIfLost( grid.size_x, grid.size_y, ghost.position_x, ghost.position_y); 

            // An instruction to move "off" the world from a grid point from which a robot has been previously lost is simply ignored by the current robot.
            if (isLostPoint && willBelost) continue;

            // If robot is about to get lost in this position 
            else if(willBelost) {

                // let's set the lost attribute
                this.setLost(true);

                // Then let's  mark the grid point with the "scent" flag to in order to avoid further robots drop off from this point
                grid.markLostPoint(this._position_x, this._position_y);

                return;
            }
            
            // Finally "persists" the current position of the robot with the ghost position 
            this.setPosition(ghost.position_x, ghost.position_y);
        }
    }
    //-------------------------------------------------------------------------
    
    
    /**
     * This method executes a command individually 
     * by detecting the command value and calling the proper method
     * according to the command.
     * 
     * This method does not update or pesists the robot position, 
     * instead it returns the future position to which the robot would move, 
     * we call this position "ghost position" thus leaving the logic of 
     * determining if the robot moves to this position in the hands of the 
     * caller / wrapper methods
     * 
     *  
     * @param {string} command  the command string to be excuted
     * @throws {Error}  
    */
    runCommand(command) {

        // Run commands on lost robots has no effects
        if(this._lost) return;

        let ghost = {

            position_x: this._position_x, 
            
            position_y: this._position_y,
        };

        switch (command) {
            
            // Rotation commands: 
            
            case CONF.ROTATE_LEFT:  this.rotateLeft(); break;
        
            case CONF.ROTATE_RIGHT: this.rotateRight(); break;

            // Move forward (default movement):
            
            case CONF.FORWARD.LABEL: ghost = this.moveForward(); break;

            // Extended - optional movements: 
            
            case CONF.BACKWARD.LABEL: ghost = this.moveBackward(); break;

            case CONF.LEFTWARD.LABEL: ghost = this.moveLeftward(); break;

            case CONF.RIGHTWARD.LABEL: ghost = this.moveRightward(); break;

            default: throw new Error(error_messages.invalid_command_param); break;
        }

        return ghost;
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * 
     * This method will be "Report" the Robot current situation in string format 
     * this._postion_x, this._postion_y, this._orientation.LABEL, this._lost 
     * 
     * Examples:
     * 
     * 1 1 E
     *  
     * 3 3 N LOST
     * 
     *  @return {string}  
    */
    reportPosition(){

        let full_position =  `${this._position_x} ${this._position_y} ${this._orientation.LABEL}` + ( (this._lost) ? ` ${CONF.LOST_LABEL}` : '' );

        return full_position;
    }
    //-------------------------------------------------------------------------

}
// End class

module.exports = Robot;