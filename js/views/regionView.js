define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/regionTemplate.html'
], function ($, _, Backbone, template) {

    return Backbone.View.extend({

        compiled: _.template(template),

        render: function () {
            this.$el.html(this.compiled(this.model.toJSON()));
        }
    });
});