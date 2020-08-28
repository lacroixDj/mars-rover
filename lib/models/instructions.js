/** 
 * This class represent the data structure to 
 * hold parsed and validated instructions 
 * (grid size + initial positions + instructions)
 * 
 * It is used by Input class, and Process class
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Instructions {

    constructor({ grid_size_x, grid_size_y, initial_positions, commands }){
            
        // Default init grid X size
        this.grid_size_x = grid_size_x || 0;
    
        // Default init grid Y size
        this.grid_size_y = grid_size_y || 0;
    
        // Validated robot initial positions array
        this.initial_positions = initial_positions || [];
    
        // Validated robot instructions array
        this.commands = commands  || [];
    }
}
// End class

module.exports = Instructions;