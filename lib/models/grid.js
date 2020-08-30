/** 
 * This class represent the Mars surface grid  
 * which is nothing else than an array[x][y]
 * 
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
class Grid {

    constructor({ grid_size_x, grid_size_y}){
            
        // Default init grid X size
        this.size_x = grid_size_x || 0;
    
        // Default init grid Y size
        this.size_y = grid_size_y || 0;
            
        // Actualy the grid itself
        this.surface = [[]];
    }

    
    /**  
     * This build the surface array beween 
     * the provided limmits X size, Y size  
     * 
    */
    buildSurface(){

        for( let i= 0; i <= this.size_x; i++ ){
            
            this.surface[i] = [];
            
            for ( let j= 0; j <= this.size_y; j++ ) this.surface[i][j] = 0;
        }
    }
    //-------------------------------------------------------------------------

    
    /**  
     * This method returns the surface array   
     * 
     * @returns array 
    */
    getSurface() {

        return this.surface;
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * This method prints the surface array   
     *  
    */
    printSurface(){

        for( let i= 0; i < this.size_x; i++ ) console.log(this.surface[i].join('|'));
    }
    //-------------------------------------------------------------------------

    
    /**  
     * This method marks some point 
     * as visited on the surface array   
     *  
     * @param int x row cordinate
     * @param int y col cordinate
    */
    markVisitedPoint(x, y) {
        
        this.surface[x][y] += 1;
    }
    //-------------------------------------------------------------------------
    
    
    /**  
     * This method marks some point 
     * as a lost point on the surface array   
     *  
     * @param int x row cordinate
     * @param int y col cordinate 
    */
    markLostPoint(x, y) {

        this.surface[x][y] = -1;
    }
    //-------------------------------------------------------------------------

}
// End class

module.exports = Grid;