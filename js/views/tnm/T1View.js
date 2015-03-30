define([
    'jquery',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'dataSources',
    'models/tnm/T1Model',
    'text!templates/tnm/T1Template.html'
], function ($, _, Backbone, tables, filters, dataSources, Model, template) {

    return Backbone.View.extend({
        id: 'T1',
        title: "Trend by biodiversity asset (measures of change in condition over time).",
        description: "This question cumulatively addresses questions regarding which biodiversity assets have increased/decreased/remained static and why and provides counts and totals (from which it is possible to then display graphically and or as proportions) for either whole of State or individual subregions.  For species, the most informative metrics are numbers of populations and mature individuals whereas for ecological communities these are number of occurrences and area of occupancy.",

        cols: [
            {
                title: "Trend",
                data: "trend"
            },
            {
                title: "Number of populations",
                data: "flora.pop"
            },
            {
                title: "Number of mature individuals",
                data: "flora.mat"
            },
            {
                title: "Number of populations",
                data: "fauna.pop"
            },
            {
                title: "Number of mature individuals",
                data: "fauna.mat"
            },
            {
                title: "Number of occurrences",
                data: "comm.occ"
            },
            {
                title: "Area of occupancy",
                data: "comm.aoo"
            }
        ],


        initialize: function () {
            this.model = new Model();
        },

        render: function (parent) {
            var child =  _.template(template)({parent: parent, id: this.id, title: this.title, description: this.description});
            $("#" + parent).append(child);
            var table = tables.initTable('#summary_table_' + this.id, {}, this.cols);
            this.model.onReady(function (){console.log("All ready")});
        }


    });


});