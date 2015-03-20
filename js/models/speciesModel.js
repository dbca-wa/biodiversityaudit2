define ([
        'underscore',
        'backbone']
    , function (_, Backbone) {

    return Backbone.Model.extend({

        taxon: function () {
            return this.get('NAMESCIEN');
        },

        common: function () {
            return this.get('NAMECOMMON');
        },

        dist: function () {
            return this.get('DIST');
        },

        records: function () {
            return this.get('records');
        }

    });
});