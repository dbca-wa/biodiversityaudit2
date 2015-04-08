define([
], function () {

    function notEmpty (val) {
        var undef = typeof val === 'undefined' || val === null;
        var emptyString = typeof val === 'string' && val.trim().length === 0;
        return !undef && !emptyString;
    }

    function isNA (val) {
        return typeof val === 'string' && val.trim().toUpperCase() === 'N/A'
    }

    return {
        notEmpty: notEmpty,
        isNA: isNA,
        regionFilter: function (regionCode){
            return function (record) {
                return record.get('SCALE') === regionCode;
            };
        }
    }
});