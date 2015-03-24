define([
    'underscore',
    'backbone',
    'text!templates/about.html'
], function (_, Backbone, template) {

    return  Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
        }

    });
});
