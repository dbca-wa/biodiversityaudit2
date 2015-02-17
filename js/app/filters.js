define([
    'underscore'
], function (_) {

    function notEmpty(s) {
        return s && s.trim().length > 0
    }


    return {
        notEmpty: notEmpty
    }


});