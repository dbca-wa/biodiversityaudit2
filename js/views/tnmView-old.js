define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tnm.html',
    'app/tableFacade',
    'views/tnm/Q70View',
    'views/tnm/Q71View'
], function ($, _, Backbone, template, tables, Q70View, Q71View) {

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
            new Q70View().render();
            new Q71View().render();
        }
    });
});