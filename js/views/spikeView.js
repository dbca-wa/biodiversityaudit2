define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/spike.html',
    'app/spike',
], function ($, _, Backbone, template, spike) {

    var data = {
        name: 'serge'
    };

    return Backbone.View.extend({
        el: '#content',

        _compiled: _.template(template),

        render: function () {
            $('#header').html('');
            $('#footer').html('');
            this.$el.html(this._compiled(data));
            window.spike = spike;
        }
    });
});