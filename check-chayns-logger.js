try {
    require('chayns-logger');
} catch (e) {
    if (e.message.indexOf('Cannot find module') > -1) {
        console.log(`\x1b[31m[chayns®net runtime] The npm package 'chayns-logger' is not installed!`);
        console.log(`                     It is a tobit software internal package.`);
        console.log(`                     Please remove usage of the package or replace it with your own logger. \n\x1b[0m`);
    }
}