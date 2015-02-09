define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    '../app/dataFacade',
    'text!templates/home.html'
], function ($, _, Backbone, bootsrap, api, template) {

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
            var ds = api.ds;
            var Q = {
                fields: "SCALE, TT_NAMESCIEN, TT_NAMESCIEN, TT_STATUSWA",
//                filters: [
//                    { exists: { field: 'TT_STATUSWA' } }
//                ]
            };

//            ds.query(Q);
//            ds.query({}).done(function (dataset) {
//               console.log("Q=", dataset.records);
//            });
            window.ds = ds;
            window.Q = Q;
            ds.fetch().done( function (ds) {
               console.log("fetch done");
               ds.query(Q).done(function () {
                  console.log("Query done", ds.fields);
               });
            });
        }
    });
});