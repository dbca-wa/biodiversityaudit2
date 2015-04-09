define([
    'jquery',
    'jqueryScrollTo',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'dataSources',
    'models/tnm/T4Model',
    'views/tnm/regionInputView',
    'views/tnm/T1View',
    'text!templates/tnm/T4Template.html',
    'text!templates/tnm/T4SummaryTemplate.html',
    'text!templates/tnm/T4DetailsTemplate.html'
], function ($, scrollTo, _, Backbone, tables, filters, dataSources, Model, RegionInputView, T1View,
             mainTemplate, summaryTemplate, detailsTemplate) {

    return T1View.extend({
        id: 'T4',
        el: '#content_panel_T4',
        title: "Research and Conservation Planning",
        description: "",

        columnDefs: [
            {
                title: "Category",
                width: '20vw',
                data: "trend",
                render: function (data) {
                    return data.rendered || data;
                }
            },
            {
                title: "Research",
                data: "flora.research",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Conservation Planning",
                data: "flora.consplan",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Research",
                data: "fauna.research",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Conservation Planning",
                data: "fauna.consplan",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Research",
                data: "communities.research",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Conservation Planning",
                data: "communities.consplan",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Research",
                data: "wetlands.research",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Conservation Planning",
                data: "wetlands.consplan",
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
                .union(_.keys(records.fauna['research']))
                .union(_.keys(records.fauna['consplan']))
                .union(_.keys(records.flora['research']))
                .union(_.keys(records.flora['consplan']))
                .union(_.keys(records.communities['research']))
                .union(_.keys(records.communities['consplan']))
                .union(_.keys(records.wetlands['research']))
                .union(_.keys(records.wetlands['consplan']))
                .value();
            var setCellData = _.bind(this.setCellData, this);
            return _(data)
                .map(function (value) {
                    var row = {
                        flora: {
                            research: {count: ''},
                            consplan: {count: ''}
                        },
                        fauna: {
                            research: {count: ''},
                            consplan: {count: ''}
                        },
                        communities: {
                            research: {count: ''},
                            consplan: {count: ''}
                        },
                        wetlands: {
                            research: {count: ''},
                            consplan: {count: ''}
                        }
                    };
                    var flora = records.flora,
                        fauna = records.fauna,
                        communities = records.communities,
                        wetlands = records.wetlands;
                    row.trend = value;
                    row.trend.rendered = value;
                    if (value in flora.research) {
                        setCellData(row, 'flora', 'research', value, flora);
                    }
                    if (value in flora.consplan) {
                        setCellData(row, 'flora', 'consplan', value, flora);
                    }
                    if (value in fauna.research) {
                        setCellData(row, 'fauna', 'research', value, fauna);
                    }
                    if (value in fauna.consplan) {
                        setCellData(row, 'fauna', 'consplan', value, fauna);
                    }
                    if (value in communities.research) {
                        setCellData(row, 'communities', 'research', value, communities);
                    }
                    if (value in communities.consplan) {
                        setCellData(row, 'communities', 'consplan', value, communities);
                    }
                    if (value in wetlands.research) {
                        setCellData(row, 'wetlands', 'research', value, communities);
                    }
                    if (value in wetlands.consplan) {
                        setCellData(row, 'wetlands', 'consplan', value, communities);
                    }
                    return row;
                })
                .value();
        }
    });
});