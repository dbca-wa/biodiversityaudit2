define([
    'jquery',
    'underscore',
    'backbone',
    'app/tableFacade',
    'text!templates/spike.html'
], function ($, _, Backbone, dt, template) {

    return Backbone.View.extend({
        el: '#content',

        cols: [
            {
                title: "trend",
                data: "trend"
            },
            {
                title: "pop flora",
                data: "flora.pop"
            },
            {
                title: "mat flora",
                data: "flora.mat"
            },
            {
                title: "pop fauna",
                data: "fauna.pop"
            },
            {
                title: "mat fauna",
                data: "fauna.mat"
            },
            {
                title: "occ comm",
                data: "comm.occ"
            },
            {
                title: "aoo comm",
                data: "comm.aoo"
            }
        ],

        rows: [
            {
                trend: "Loss",
                flora: {
                    pop: 12,
                    mat:45
                },
                fauna: {
                    pop: 49,
                    mat:67
                },
                comm: {
                    occ: 112,
                    aoo:234
                }
            },
            {
                trend: "Static",
                flora: {
                    pop: 99,
                    mat:0
                },
                fauna: {
                    pop: 49,
                    mat:67
                },
                comm: {
                    occ: 112,
                    aoo:234
                }
            },
        ],

        render: function () {
            this.$el.html(_.template(template, {}));
            var table = dt.initTable('#spikeTable', {}, this.cols);
            table.populate(this.rows);
        }
    });
});