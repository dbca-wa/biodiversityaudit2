define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/regions.html',
    'app/map',
    'models/regionModel',
    'views/regionView'
], function ($, _, Backbone, template, map, RegionModel, RegionView) {

    function handleRegionClick (properties) {
        var model = new RegionModel(properties);
        var view = new RegionView({model: model});
        console.log("Region clicked: ", properties);
        view.$el = this.$('#region_content');
        view.render();
    }

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
            map.init_map('map', handleRegionClick);
        }
    });
});