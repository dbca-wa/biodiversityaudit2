define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        el: '#footer',

        initialize: function () {
            console.log('views - footer - init');
            this.render();
        },

        render: function () {
            console.log('views - footer - render');
            this.$el.html(_.template(template, {}));
        }
    });
});