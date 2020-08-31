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
        this._robots = [];

        // The martian robots setup (grid size + initial positions + commands)
        this._instructions =  {}
        
        // Output stack
        this._output = [];
    }
    //-------------------------------------------------------------------------   

    
    /**  
     * First method of this controller class. 
     * 
     * Catch the Instructions object passed by Input class
     * Thes invokes the Grid() object and calls its build method 
     * Finally calls buildRobots methods which invokes the Robot model class 
     * for building Robots many times as necesary based on the input instructions
     * 
    */
    setUpAndRun(instructions_data) {

        try {
            
            // Validates the input setup
            if(_.isEmpty(instructions_data)) throw new Error(error_messages.empty_instructions_setup);
                
            // Build instructions data object
            this._instructions = new Instructions(instructions_data);

            // Let's create our Grid object
            this._grid = new Grid(this._instructions);

            // Let's build the Grid surface
            this._grid.buildSurface();

            // build robots
            this.buildRobots(this._instructions);
        
            // Move robots
            this.startRobotsAutopilot();
            
            //return this.buildGrid(args)
            return Promise.resolve(this._output); 
        
        } catch (error) {

            // Send the errors and break the chain
            return Promise.reject(error);
        }
    }
    //-------------------------------------------------------------------------


    /**  
     * This meethod iterates on input insturctions then 
     * invokes the Robot model class for building Robots 
     * many times as necesary
    */
    buildRobots({initial_positions, commands}) {

        // Check if there are initial positions entries, the number of starting positions will determine the number of robots to be built
        if(_.isEmpty(initial_positions))  throw new Error(error_messages.empty_bot_positions_input);
    
        // Commands entries must be present as well
        if(_.isEmpty(commands))  throw new Error(error_messages.empty_bot_commands_input);

        // The number of command lines must be consistent and equal to the number of robots we want to build
        if(initial_positions.length != commands.length ) throw new Error(error_messages.invalid_positions_commands_lenght);

        // if everything went well then we can build our robots
        // We are goint to use a for loop which is faster than any other loops methods
        for(let i = 0; i < initial_positions.length; i++){
        
            let myRobot = new robot(initial_positions[i]);
        
            myRobot.setCommands(commands[i]);
        
            this._robots.push(myRobot);
        }
    }
    //-------------------------------------------------------------------------

    
    /**  
     * This method iterates on robots collection 
     * Call the "autopilot mode" for each robot found
     * 
     * Autopilots mode is a Robots method that "ignites"
     * its robot navigation based on the robot's commands
     * attributes
     * 
    */
    startRobotsAutopilot() {

        // There should be at least one robot in the collection
        if(_.isEmpty(this._robots) || !this._robots.length)  throw new Error(error_messages.empty_bots_collection);
        
        // We are goint to use a for loop which is faster than any other loops methods
        for(let i = 0; i < this._robots.length; i++){
            
            // Call the "autopilot mode" for each robot in our collection
            this._robots[i].runAutopilot(this._grid);

            // Get the last position of the robot after executing the autoplite mode 
            this._output.push(this._robots[i].reportPosition());
        }
    }
    //-------------------------------------------------------------------------

}
// End class.

// Exporting the class instance
module.exports = new Controller();