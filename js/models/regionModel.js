define([
    'jquery',
    'underscore',
    'backbone',
    'app/config',
    'models/fauna'
], function ($, _, Backbone, config, fauna) {

    var model = Backbone.Model.extend({

        initialize: function () {
            this.set("spatial_profile_url", this.getSpatialProfileURL());
//            _.bindAll(this);
            fauna.onReady(_.bind(this.setFaunaRecords, this))
        },

        /*
         Parse the popup html for a href that contains the ckan url
         */
        //@todo: There must be a better way to obtain the spatial profile url even if we have to hard the 55 of them in the config
        getSpatialProfileURL: function () {
            // parse the popup attribute for a href that contains the ckan url
            var node = $('<div>' + this.get('popup') + '</div>');
            return node.find('a[href*="' + config.ckan.base_url + '"]').attr('href');
        },

        setFaunaRecords: function (collection, allRecords) {
            var regionCode = this.get('SUB_CODE');
            var myRecordsBySpecies = _(allRecords)
                .filter(function (r) {
                    return r.get('SCALE') === regionCode;
                })
                .groupBy(function (r) {
                    return r.get('TT_NAMESCIEN');
                })
                .value();
            this.set('fauna', myRecordsBySpecies);
        }
    });

    return model;
});