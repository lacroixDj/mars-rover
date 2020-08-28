// Error messages dictionary lib
const Error_messages = require('../validations/error_messages');

/** 
 * This is a plain object for configure
 * minimist CLI argv parsing oprions
 * 
 * @author Frank Lacroix <lacroixdj@gmail.com.com>
*/
const argv_options = {
            
    string: ['file'],
    
    alias: { f:'file' },

    unknown: () => { throw new Error(Error_messages.invalid_option) }
};

module.exports = argv_options;