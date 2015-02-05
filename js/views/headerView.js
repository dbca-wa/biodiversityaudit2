define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        el: '#header',

        initialize: function () {
            console.log('views - header - init');
            this.render();
        },

        render: function () {
            console.log('views - header - init');
            this.$el.html(_.template(template, {}));
        }
    });
});