define([
    'underscore'
], function (_) {

    function notEmpty(val) {
        var undef = typeof val === 'undefined' || val === null;
        var emptyString = typeof val === 'string' && val.trim().length === 0;
        return !undef && !emptyString;
    }


    return {
        notEmpty: notEmpty
    }


});