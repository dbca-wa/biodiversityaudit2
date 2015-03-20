define([
    'jquery',
    'underscore',
    'backbone',
    '../../app/tableFacade',
    'app/filters',
    'views/tableView',
    'text!templates/species/summaryTemplate.html',
    'text!templates/region/detailsDefaultTemplate.html',
    'text!templates/region/threatsSummaryTemplate.html',
    'views/region/faunaSummaryView'
], function ($, _, Backbone, tables, filters, TableView, summaryTemplate, detailsTemplate, threatsCellTemplate, FaunaSummaryView) {

    // very similar to the fauna view in region, except that taxon=region
    /*
        Identical to the fauna view in region, except that the first column header is Region instead of Taxon.
     */
    var View = FaunaSummaryView.extend({
        el: '#taxonTab',

        columnDefinitions: [
            {
                title: 'Subregion',
                width: '25%',
                data: 'species',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Threats',
                width: '25%',
                data: 'threats',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Status WA',
                width: '15%',
                data: 'status',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Trends',
                data: 'trends',
                width: '15%',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Management Requirement',
                width: '15%',
                data: 'management',
                render: function (data) {
                    return data.rendered
                }
            }
        ],

        initialize: function (options) {
            // clear previous tables
            this.$el.find('summary_content').html('');
            this.$el.find('details_content').html('');
        },

        buildSummaryContent: function () {
            var values = {label: this.label || ""};
            return _.template(summaryTemplate)(values);
        }
    });

    return View;

});