// Lodash is a general utils js lib
const _ = require('lodash');

// Instruuctions model class
const Instructions = require('../models/instructions');

// Grid model 
const Grid = require('../models/grid')

// Robot model class
const robot = require('../models/robot')

// Error messages dictionary lib
const error_messages = require('../validations/error_messages');



/**
 * 
 * This class is in charge of encapsulating the logic and  flow execution 
 * of the application,  based on the input instructions previously 
 * validated and provided by the Input () class.
 * 
 * Its main functions are to instantiate the Grid() object, 
 * also to instantiate (build) as many Robots as necessary by calling the Robot class
 * 
 * It also interpretates the commands for
 * moving or rotate Robots inside the grid.
 * 
 * Check for Robots 'scents' in lost points ç
 * 
 * and finally prepare the output to pass to the Output class
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Controller {

    constructor(){

        // The Grid object
        this._grid = {}

        // The Robots collection
        this._robots = {};

        // The martian robots setup (grid size + initial positions + commands)
        this._instructions =  {}
        
        // Output object
        this._output = {};
    }
    //-------------------------------------------------------------------------   

    
    /**  
     * First method of this controller class. 
     * Instantiate the Grid() object, 
     * also to instantiate (build) as many Robots as necessary by calling the Robot class
     * 
    */
    setUp(instructions_data) {

        try {
            
            // Validates the input setup
            if(!_.isEmpty(instructions_data)) {
                
                //console.table(instructions_data);
                // Build instructions data object
                this._instructions = new Instructions(instructions_data);

                // Let's create our Grid object
                this._grid = new Grid(this._instructions);

                // Let's build the Grid surface
                this._grid.buildSurface();

                this._grid.printSurface();



                //return this.buildGrid(args)
                return Promise.resolve(this._grid.getSurface()); 
                //return Promise.resolve(instructions_setup) 
                
                //.then( instructions_setup => { return Promise.resolve(instructions_setup) })
                
                //.catch(error => { return Promise.reject(error) });
            } 
            
            // Error empty_instructions_setup
            else  throw new Error(error_messages.empty_instructions_setup);
        
        } catch (error) {

            // Send the errors and break the chain
            return Promise.reject(error);
        }
    }
    //-------------------------------------------------------------------------


}
// End class.

// Exporting the class instance
module.exports = new Controller();