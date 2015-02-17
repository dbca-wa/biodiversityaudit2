define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/spike.html',
    'models/fauna',
    'views/tableView',
    'app/filters'
], function ($, _, Backbone, template, fauna, TableView, filters) {


    return Backbone.View.extend({
        el: '#content',

        _compiled: _.template(template),

        render: function () {
//            $('#header').html('');
//            $('#footer').html('');
            this.$el.html(this._compiled({}));

            fauna.onReady(function (collection, records) {
                var view = new TableView({
                    collection: collection,
                    model: records,
                    id: 'spikeTable',
                    fields: ['SCALE', 'TT_NAMESCIEN', 'TT_FUTURETHREATS_CAT', 'TT_PASTPRESSURES_CAT'],
                    filters: [
//                        {
//                            field: 'TT_FUTURETHREATS_CAT',
//                            predicate: filters.notEmpty
//                        }

                    ]

                });
                view.render();
            });

            window.fauna = fauna;
        }
    });
});