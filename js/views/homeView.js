define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
        }
    });
});