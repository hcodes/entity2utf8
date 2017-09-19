'use strict';

let i = 0;
let hasErrors = false;

module.exports = {
    hasErrors: function() {
        return hasErrors;
    },
    log: function(text) {
        console.log(text);
    },
    error: function(text) {
        hasErrors = true;

        console.error(text);
        i++;
    },
    errorNewLine: function(text) {
        this.error((i ? '\n' : '') + text);
    }
};
