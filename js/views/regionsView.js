define([
    'jquery',
    'jqueryScrollTo',
    'underscore',
    'backbone',
    'text!templates/regions.html',
    'app/map',
    'models/regionModel',
    'views/region/regionView'
], function ($, ScrollTo, _, Backbone, template, map, RegionModel, RegionView) {

    function handleRegionClick (properties, type) {
        var model = new RegionModel(properties);
        var view = new RegionView({model: model});
        view.$el = $('#region_content');
        view.render(type);
        $.scrollTo(view.$el, 200);
    }

    return Backbone.View.extend({
        el: '#content',

        render: function (type, id) {
            var regionProperties;
            this.$el.html(_.template(template, {}));
            map.init_map('map', handleRegionClick);
            // show region?
            if (id) {
                // warning! if region data is shown before the ibra json data are loaded, we won't have access to it's
                // name or the url for the profile
                regionProperties = map.getRegionsProperties()[id] || {REG_NAME: id, SUB_CODE: id};
                handleRegionClick(regionProperties, type);
            }
        }
    });
});