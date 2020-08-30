/** 
 * In this file we define the constants 
 * used in across the application
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/


/**
 * 
 * Minimun grid size constraint 
 *  
*/ 

const MIN_GRID_SIZE = 0;

//-------------------------------------------------------------------------


/**
 * 
 * Max grid size constraint
 *  
*/ 

const MAX_GRID_SIZE = 50;

//-------------------------------------------------------------------------


/**
 * 
 * Max instruction lenght constraint
 *  
*/ 

const MAX_COMMANDS_LENGTH = 100;

//-------------------------------------------------------------------------


/**
 *  CARDINAL POINTS INTEGER / BINARY REPRESENTATION: 
 * 
 *  [TL;DR]:  I recognize that the explanation may seem long and complex. 
 *  But actually the implementation is incredibly simple, 
 *  the proof is that it only uses two thin methods Robot.rotateLeft() and  Robot.rotateRight() 
 *  and a few constants. This is a is a binary arithmetic algorithm approach
 *  that simulates a compass rotation in steps of 90º on both clockwise and counterclockwise directions
 * ----------------------------------------------------------------------------------------------------
 * 
 * 
 *  We needed to emulate a simple compass with 90º degrees rotations 
 *  in both left (counter-clockwise) and right (clockwise) directions.
 *  
 *  So instead of dealing this with messy if / else or switch, we will handle it
 *  by implementing circular-shift or bit-rotations using bitwise rortations 
 *  this is a more clean, efficient, and elegant solution. 
 * 
 *  Since it is a binary arithmetic algorithm, it is much more efficient.
 *  Also if we want  to increase the precision of our compass in the future 
 *  for example including NW, NE, SE, SE or even make a compass of 360º degrees 
 *  (or a greater precision) we could do it with very few changes by increasing the bit mask.
 * 
 *  So assuming the following:
 *  
 *  [ Sting - Integer - Binary ]  
 *  
 *  - North =    1    =  0001
 *  - West  =    2    =  0010
 *  - South =    4    =  0100
 *  - East  =    8    =  1000
 *   
 *  When we need to turn 90º from North to -> West we will rotate bits to the left (counter-clockwise mode)
 *  1,2,4,8...1,2,4,8...1  =  N,W,S,E...N,W,S,E...N 
 *  
 *  The same applies in reverse, if turning 90º from North to -> East we will rotate bits to the right (clockwise mode)
 *  1,8,4,2...1,8,4,2...1  =  N,E,S,W...N,E,S,W...N  
 * 
 * 
 *                   N = 1 = 0001  
 *                       | 
 *                       |
 *   W = 2 = 0010 -------|------- E = 8 = 1000
 *                       |
 *                       |
 *                   S = 4 = 0100   
 *
 *  
 *  Let's define our cardinal points by using a ES6 Map object.
 * 
 *  We will use integer VALUE for computation purposes, 
 *  but also we need to keep string LABEL for human readable output
 *  
 *  We map  the same values with both numeric <<==>> string keys 
 *  in order to make easier (overload) the mutator / setter   
 *  Robot.setOrientation() method
 * 
 * 
 * We could extend this al 
 * 
*/ 

const NORTH =  { LABEL: 'N', VALUE: 1};

const WEST  =  { LABEL: 'W', VALUE: 2};

const SOUTH =  { LABEL: 'S', VALUE: 4};

const EAST  =  { LABEL: 'E', VALUE: 8};


CARDINAL_POINTS = new Map ([
    
    [ 1, NORTH ] , [ 'N', NORTH ], 
    
    [ 2, WEST  ] , [ 'W', WEST  ],   
    
    [ 4, SOUTH ] , [ 'S', SOUTH ], 
    
    [ 8, EAST  ] , [ 'E', EAST  ], 

]); 

//-------------------------------------------------------------------------


/**
 * 
 * Simulates 90º rotation by shifting 1 bit to the left / right depending on the case
 *  
*/ 

const ROTATE_ONCE = 1; 

//-------------------------------------------------------------------------


/**
 *  Const to emulate 4 bit integers length (i.e.: 0001, 0010, 0100, 1000) 
 *  instead of native javascript 32 bits length integers.
 *  
 *  Example:
 *  
 *  let x = 1 = 0001:
 *  
 *  0000 0000 0000 0000 0000 0000 0000 0001
 *                                    |___|---> truncated 4 bits int
 * 
 *  Result of rotating left by 1 bit, x = 2 = 0010:
 *  
 *  0000 0000 0000 0000 0000 0000 0000 0010
 * 
 *  We always take the righmost 4 bits to emulate 
 *  our compass 90º degrees rotation 
 * 
 *  For more information plese see: BITS_INTEGER_MASK, Robot.rotateLeft() , Robot.rotateRight().
 * 
*/ 

const BITS_INTEGER_LENGTH = 4;

//-------------------------------------------------------------------------


/**
 *  Mask constant to limit integers to 4 bits.
 *  
 *  This is used in conjunction with the previous BITS_INTEGER_LENGTH constant 
 *  in order to turn off all the remaining 28 bits (from 32) to 0 
 *  and leaving only the righmost 4 bits as we need.
 * 
 *  So we will use a bitwise "and" (&) to mask our bits. 
 * 
 *  Our mask will have 0 on the bits we want discard, 
 *  in this case the leftmost 28 bits remaining (any value & 0 => is always 0) 
 * 
 *  In other hand, our mask will have 1 on the first 4 bits we want to keep 
 *  (any value & 1  => is always any value)
 *  
 *  Example:
 *  
 *  0000 0000 0000 0000 0000 0000 0000 0010  <--- The previous result (see BITS_INTEGER_LENGTH)
 *  0000 0000 0000 0000 0000 0000 0000 1111  <--- Our mask
 *  ----------------------------------------
 *  0000 0000 0000 0000 0000 0000 0000 0010  <--- The result after the & (and) operation
 * 
 *  Due to our BITS_INTEGER_LENGTH == 4 we need to use the number 15 as a mask because 
 *  15 = 1111 = 0000 0000 0000 0000 0000 0000 0000 1111.
 * 
 *  But instead of hardcode 15 directly, let's set it dynamically 
 *  according to the value in BITS_INTEGER_LENGTH, so lets shift to the left 
 *  many bits we can use (1 << BITS_IN_INTEGER) = (10000) = 16 and then substract - 1. 
 *  this will convert 10000 into 01111 = 15;
 * 
*/ 

const BITS_INTEGER_MASK = (1 << BITS_INTEGER_LENGTH) - 1;

//-------------------------------------------------------------------------


/**
 * 
 * Moving directions
 * By now we are only using forward movement but
 * with this approach we  can extend Robots movement in the future
 *  
 * For lateral moving LEFTWARD / BACKWARD (no rotation)
 * lets use 'I' / 'D' from spanish 'Izquierda y Derecha'
 * to avoid get confused with 'L' / 'R' input commands 
 * for robot rotation.
 * 
*/ 
const FORWARD   =  { LABEL: 'F'  , VALUE:   1 };

const BACKWARD  =  { LABEL: 'B' , VALUE:  -1 };

const LEFTWARD  =  { LABEL: 'I' , VALUE:  -1 };  

const RIGHTWARD =  { LABEL: 'D', VALUE:   1 };

//-------------------------------------------------------------------------


module.exports = {
    
    MIN_GRID_SIZE,
    
    MAX_GRID_SIZE,
    
    MAX_COMMANDS_LENGTH,

    NORTH,

    WEST,

    SOUTH,

    EAST,

    CARDINAL_POINTS,

    ROTATE_ONCE,

    BITS_INTEGER_LENGTH,

    BITS_INTEGER_MASK,

    FORWARD,

    BACKWARD,

    LEFTWARD,

    RIGHTWARD,
};