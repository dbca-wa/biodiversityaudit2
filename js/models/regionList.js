define([
        'underscore',
        'backbone',
        'config',
        'models/regionModel',
    ],
    function (_, Backbone, config, RegionModel) {

        return Backbone.Collection.extend({
            model: RegionModel,

            initialize: function () {
                this.deferred = this.fetch();
            },

            fetch: function () {
                var sourceUrl = config.datasource === 'test' ? config.urls.ibra_geojson_test : config.urls.ibra_geojson;
            }
        });


    });