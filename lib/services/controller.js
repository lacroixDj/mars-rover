// Instruuctions model class
const Instructions = require('../models/instructions');

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
 * Move or rotate Robots inside the grid.
 * 
 * Check for Robots 'scents' in lost points ç
 * 
 * and finally prepare the output to pass to the Output class
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Controller {

    constructor(){

        // Robot Instructions file path
        this._instructions_file_path = "";
        
        // The robots setup (grid size + initial positions + commands)
        this._instructions =  new Instructions({});

        //Grid

        //Robots
    }
    //-------------------------------------------------------------------------   

    
    /**  
     * First method of this controller class. 
     * Instantiate the Grid() object, 
     * also to instantiate (build) as many Robots as necessary by calling the Robot class
     * 
    */
    setUp(instructions_setup) {

        try {
            
            // Validates the input setup
            if(!_.isEmpty(instructions_setup)) {
                
                return this.buildGrid(args)
                
                .then( instructions_setup => { return Promise.resolve(instructions_setup) })
                
                .catch(error => { return Promise.reject(error) });
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