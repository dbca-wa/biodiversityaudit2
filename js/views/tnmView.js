define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tnm.html',
    'app/tableFacade',
    'views/tnm/Q71View'
], function ($, _, Backbone, template, tables, Q71View) {

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
            new Q71View().render();
        }
    });
});