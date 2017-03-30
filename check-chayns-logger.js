try {
    require('chayns-logger');
} catch (e) {
    if (e.message.indexOf('window') === -1) {
        console.log(`\x1b[31m----------------------------------------------------------------------------------------------------------------------
|  chayns-logger is not installed!                                                                                    
|  The chayns-logger npm package is not open source. Please remove or replace the chayns-logger with your own logger. 
----------------------------------------------------------------------------------------------------------------------\n\x1b[0m`);
    }
}