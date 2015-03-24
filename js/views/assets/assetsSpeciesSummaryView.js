define([
    'jquery',
    'underscore',
    'backbone',
    '../../app/tableFacade',
    'app/filters',
    'views/tableView',
    'text!templates/assets/assetsSummaryTemplate.html',
    'text!templates/region/detailsDefaultTemplate.html',
    'text!templates/region/threatsSummaryTemplate.html',
    'views/region/faunaSummaryView'
], function ($, _, Backbone, tables, filters, TableView, summaryTemplate, detailsTemplate, threatsCellTemplate, FaunaSummaryView) {

    // very similar to the fauna view in region, except that taxon=region
    /*
        Identical to the fauna view in region, except that the first column is the region instead of the taxon
     */
    return FaunaSummaryView.extend({
        el: '#result_content',

        columnDefinitions: [
            {
                title: 'Subregion',
                width: '25%',
                data: 'id',
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
            this.label = options.label || "";
        },

        buildSummaryContent: function () {
            var values = {label: this.label || ""};
            return _.template(summaryTemplate)(values);
        }
    });

});