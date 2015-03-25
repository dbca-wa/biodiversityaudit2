define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/regions.html',
    'app/map',
    'models/regionModel',
    'views/region/regionView'
], function ($, _, Backbone, template, map, RegionModel, RegionView) {

    function handleRegionClick (properties) {
        var model = new RegionModel(properties);
        var view = new RegionView({model: model});
        view.$el = this.$('#region_content');
        view.render();
    }

    return Backbone.View.extend({
        el: '#content',

        render: function (id) {
            var regionProperties;
            this.$el.html(_.template(template, {}));
            map.init_map('map', handleRegionClick);
            // show region?
            if (id) {
                // warning! if region data is shown before the ibra json data are loaded, we won't have access to it's
                // name or the url for the profile
                regionProperties = map.getRegionsProperties()[id] || {REG_NAME: id, SUB_CODE: id};
                handleRegionClick(regionProperties);
            }
        }
    });
});