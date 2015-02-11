define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    '../app/dataFacade',
    'text!templates/home.html'
], function ($, _, Backbone, bootsrap, api, template) {

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
        }
    });
});