define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'text!templates/data.html'
], function ($, _, Backbone, config, template) {

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            var data = {
                fauna_xlsm: config.urls.fauna_xlsm,
                flora_xlsm: config.urls.flora_xlsm,
                communities_xlsm: config.urls.communities_xlsm,
                wetlands_xlsm: config.urls.wetlands_xlsm
            };
            this.$el.html(_.template(template)(data));
        }
    });
});