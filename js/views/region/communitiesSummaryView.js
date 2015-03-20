define([
    'jquery',
    'underscore',
    'backbone',
    'views/region/faunaSummaryView',
], function ($, _, Backbone, FaunaSummaryView) {

    return FaunaSummaryView.extend({
        el: '#communitiesTab',

        columnDefinitions: [
            {
                title: 'Community',
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
        ]

    });



});