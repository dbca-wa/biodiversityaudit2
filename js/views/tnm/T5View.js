define([
    'jquery',
    'jqueryScrollTo',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'dataSources',
    'models/tnm/T5Model',
    'views/tnm/regionInputView',
    'views/tnm/T1View',
    'text!templates/tnm/T5Template.html',
    'text!templates/tnm/T5SummaryTemplate.html',
    'text!templates/tnm/T5DetailsTemplate.html'
], function ($, scrollTo, _, Backbone, tables, filters, dataSources, Model, RegionInputView, T1View,
             mainTemplate, summaryTemplate, detailsTemplate) {

    return T1View.extend({
        id: 'T5',
        el: '#content_panel_T5',
        title: "Evaluation, direct management et indirect management.",
        description: "",

        columnDefs: [
            {
                title: "Category",
                width: '40vw',
                data: "trend",
                render: function (data) {
                    return data.rendered || data;
                }
            },
            {
                title: "Threatened flora",
                data: "flora.management",
                width: '15vw',
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Threatened fauna",
                data: "fauna.management",
                width: '15vw',
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Threatened/priority ecological communities",
                data: "communities.management",
                width: '15vw',
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Wetlands",
                data: "wetlands.management",
                width: '15vw',
                render: function (data) {
                    return data.rendered || data.count;
                }
            }
        ],


        getModelForRegion: function(regionCode) {
            return new Model(regionCode);
        },

        getMainTemplate: function () {
            return mainTemplate;
        },

        getSummaryTemplate: function () {
            return summaryTemplate;
        },

        getDetailsTemplate: function () {
            return detailsTemplate;
        },

        /*
         Reformat data from model to accommodate the table rows definition
         */
        buildSummaryRows: function (records) {
            var data = _([])
                .union(_.keys(records.fauna['management']))
                .union(_.keys(records.flora['management']))
                .union(_.keys(records.communities['management']))
                .union(_.keys(records.wetlands['management']))
                .value();
            var setCellData = _.bind(this.setCellData, this);
            return _(data)
                .map(function (value) {
                    var row = {
                        flora: {
                            management: {count: ''}
                        },
                        fauna: {
                            management: {count: ''}
                        },
                        communities: {
                            management: {count: ''}
                        },
                        wetlands: {
                            management: {count: ''}
                        }
                    };
                    var flora = records.flora,
                        fauna = records.fauna,
                        communities = records.communities,
                        wetlands = records.wetlands;
                    row.trend = value;
                    row.trend.rendered = value;
                    if (value in flora.management) {
                        setCellData(row, 'flora', 'management', value, flora);
                    }
                    if (value in fauna.management) {
                        setCellData(row, 'fauna', 'management', value, fauna);
                    }
                    if (value in communities.management) {
                        setCellData(row, 'communities', 'management', value, communities);
                    }
                    if (value in wetlands.management) {
                        setCellData(row, 'wetlands', 'management', value, communities);
                    }
                    return row;
                })
                .value();
        }
    });
});