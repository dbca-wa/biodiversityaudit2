define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/footer.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({
        el: '#footer',

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(_.template(template, {}));
        }
    });
});