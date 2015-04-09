define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tnm.html',
    'app/tableFacade',
    'views/tnm/T1View',
    'views/tnm/T3View'
], function ($, _, Backbone, template, tables, T1View, T3View) {

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            var parentId = 'accordion';
            var t1View, t2View, t3View, t4View, t5View;
            this.$el.html(_.template(template, {}));

            t1View = new T1View();
            t1View.render(parentId);

            t3View = new T3View();
            t3View.render(parentId);
        }
    });
});