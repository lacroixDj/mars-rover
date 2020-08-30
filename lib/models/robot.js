// Universal unique id utility lib
const { v4: uuidv4 } = require('uuid');

// Require global configuration constants
const CONF = require('../config/constants');

/** 
 * This class represent a model for a Robot
 * it holds the attributes and its methods.
 * 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Robot {

    constructor(postion_x, postion_y, orientation, lost, commands){
            
        // Robot unique indentifier (this maybe will be useful in the future)
        // (perhaps to differentiate robots from each other, or allow  to get a robot by id)
        this._id = uuidv4();
        
        // Robot position X 
        this._postion_x = postion_x || 0;
    
        // Robot position X 
        this._postion_y = _postion_y || 0;
        
        // Initialize orientation empty object
        this._orientation = {}
        
        // Mutator method to set orientation attribute
        this.setOrientation(orientation);
        
        // Boolean that represents whether the robot is lost or not
        this._lost = lost || false;

        // String commands
        this._commands = commands || '';
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
        
        let intOrientation = CONF.BITS_INTEGER_MASK & ((this._orientation.intOrientation << CONF.ROTATE_ONCE) | (this._orientation.intOrientation >>> (CONF.BITS_INTEGER_LENGTH - CONF.ROTATE_ONCE)));
        
        this.setOrientation(intOrientation);
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

        let intOrientation = CONF.BITS_INTEGER_MASK & ((this._orientation.intOrientation << (CONF.BITS_INTEGER_LENGTH - CONF.ROTATE_ONCE)) | (this._orientation.intOrientation >>> CONF.ROTATE_ONCE));

        this.setOrientation(intOrientation);
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
        const { forward_backward , leftward_rightward } = getMovementDirection(direction);

        switch (this._orientation.LABEL) {
        
            case CONF.NORTH.LABEL:
                position_x = this._postion_x + leftward_rightward;
                position_y = this._postion_y + forward_backward;
            break;

            case CONF.WEST.LABEL:
                position_x = this._postion_x - forward_backward;
                position_y = this._postion_y + leftward_rightward;
            break;

            case CONF.SOUTH.LABEL:
                position_x = this._postion_x - leftward_rightward
                position_y = this._postion_y - forward_backward;
            break;

            case CONF.EAST.LABEL:
                position_x = this._postion_x + forward_backward;
                position_y = this._postion_y - leftward_rightward;
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
            
            case CONF.FORWARD.LABEL:
                forward_backward = CONF.FORWARD.VALUE;
            break;

            case CONF.BACKWARD.LABEL:
                forward_backward = CONF.BACKWARD.VALUE;
            break;
            
            case CONF.RIGHTWARD.LABEL:
                leftward_rightward= CONF.RIGHTWARD.VALUE;
            break;
        
            case CONF.LEFTWARD.LABEL:
                leftward_rightward= CONF.LEFTWARD.VALUE;
            break;
        }

        return { forward_backward , leftward_rightward }
    }
    //-------------------------------------------------------------------------


    /**  
     * 
     * Determine if the Robot is lost 
     * whether by lost flag, or by robot current positon
     * 
     * or by 'shadow' postion provided by optional params
     * this helps to determine if the robot will be lost with given
     * position before change (persists) its actual position
     * 
     *  @return {object}  
    */
    checkIfLost(limit_x, limit_y, position_x, position_y) {
        
        if (this._lost) return this._lost; // the lost flag was true
        
        let _position_x = position_x || this._postion_x;

        let _position_y = position_y || this._postion_y;

        let lost_in_x = _position_x < 0  || _position_x > limit_x;

        let lost_in_y = _position_y < 0  || _position_y > limit_y;

        return (lost_in_x || lost_in_y)
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

        this._postion_x = position_x;

        this._postion_y = position_y;
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

        let full_position =  `${this._postion_x} ${this._postion_y} ${this._orientation.LABEL}` + ( (this._lost) ? ` ${this._orientation.LABEL}` : '' );

        return full_position;
    }
    //-------------------------------------------------------------------------

}
// End class

module.exports = Robot;