define([
    'underscore',
    'backbone',
    'config',
    'text!templates/about.html'
], function (_, Backbone, config, template) {

    return  Backbone.View.extend({
        el: '#content',

        render: function () {
            var data = {
                methodology_pdf: config.urls.methodology_pdf
            };
            this.$el.html(_.template(template)(data));
        }

    });
});
