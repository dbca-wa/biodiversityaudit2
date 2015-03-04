define ([
        'underscore',
        'backbone']
    , function (_, Backbone) {

    return Backbone.Model.extend({

        taxon: function () {
            return this.get('TT_NAMESCIEN');
        },

        common: function () {
            return this.get('TT_NAMECOMMON');
        },

        dist: function () {
            return this.get('TT_DIST');
        },

        records: function () {
            return this.get('records');
        }

    });
});