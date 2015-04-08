define([
    'jquery',
    'jqueryScrollTo',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'dataSources',
    'models/tnm/T1Model',
    'views/tnm/regionInputView',
    'text!templates/tnm/T1Template.html',
    'text!templates/tnm/T1SummaryTemplate.html',
    'text!templates/tnm/T1DetailsTemplate.html'
], function ($, scrollTo, _, Backbone, tables, filters, dataSources, T1Model, RegionInputView,
             mainTemplate, summaryTemplate, detailsTemplate) {

    return Backbone.View.extend({
        id: 'T1',
        el: '#content_panel_T1',
        title: "Trend by biodiversity asset (measures of change in condition over time).",
        description: "This question cumulatively addresses questions regarding which biodiversity assets have increased/decreased/remained static and why and provides counts and totals (from which it is possible to then display graphically and or as proportions) for either whole of State or individual subregions.  For species, the most informative metrics are numbers of populations and mature individuals whereas for ecological communities these are number of occurrences and area of occupancy.",

        columnDefs: [
            {
                title: "Trend",
                width: '20vw',
                data: "trend",
                render: function (data) {
                    return data.rendered || data;
                }
            },
            {
                title: "Number of populations",
                data: "flora.population",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Number of mature individuals",
                data: "flora.mature",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Number of populations",
                data: "fauna.population",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Number of mature individuals",
                data: "fauna.mature",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Number of occurrences",
                data: "communities.occurrence",
                render: function (data) {
                    return data.rendered || data.count;
                }
            },
            {
                title: "Area of occupancy",
                data: "communities.aoo",
                render: function (data) {
                    return data.rendered || data.count;
                }
            }
        ],

        summaryCellTemplate: _.template(
            '<a title="click to view details." id="<%= id %>"><%= val %></a></span>'
        ),

        initialize: function () {
        },

        render: function (parent) {
            var child = _.template(mainTemplate)({
                    parent: parent,
                    id: this.id,
                    title: this.title,
                    description: this.description});
            var inputView;
            $("#" + parent).append(child);
            inputView = new RegionInputView({el: '#region_input_'+ this.id});
            inputView.render();
            inputView.setSelectCallback(_.bind(this.renderSummary, this));
        },

        renderSummary: function (region_code) {
            var template = _.template(summaryTemplate)({id: this.id});
            this.getSummaryContentElement().html(template);
            this.clearDetails();
            var model = new T1Model(region_code);
            var tableOptions = {
                'paging': false,
                'searching': false,
                'destroy': true
            };
            var buildRows = _.bind(this.buildSummaryRows, this);
            var renderDetails = _.bind(this.renderDetails, this);
            var table = tables.initTable(this.getSummaryTableElement(), tableOptions, this.columnDefs);
            // bind the links to the renderDetails method
            table.on('draw.dt', function (e) {
                $(e.target).find("td a").on('click', function (e) {
                    renderDetails(e.target.id, model);
                });
            });
            model.onReady(function (records) {
                var rows = buildRows(records);
                table.clear();
                table.populate(rows);
            });

        },

        /*
         Reformat data from model to accommodate the table rows definition
         */
        buildSummaryRows: function (records) {
            function setCellData(row, data, type, trend, source) {
                row[data][type] = source[type][trend];
                row[data][type].rendered = cellTemplate({
                    id: [data, type, trend].join('_'),
                    val: row[data][type].count || ''
                });
            }

            // build a list of unique trends
            var trends = _([])
                .union(_.keys(records.fauna['population']))
                .union(_.keys(records.fauna['mature']))
                .union(_.keys(records.flora['population']))
                .union(_.keys(records.flora['mature']))
                .union(_.keys(records.communities['occurrence']))
                .union(_.keys(records.communities['occurrence']))
                .value();
            var cellTemplate = this.summaryCellTemplate;
            return _(trends)
                .map(function (trend) {
                    var row = {
                        flora: {
                            population: {count: ''},
                            mature: {count: ''}
                        },
                        fauna: {
                            population: {count: ''},
                            mature: {count: ''}
                        },
                        communities: {
                            occurrence: {count: ''},
                            aoo: {count: ''}
                        }
                    };
                    var flora = records.flora,
                        fauna = records.fauna,
                        communities = records.communities;
                    row.trend = trend;
                    row.trend.rendered = trend;
                    if (trend in flora.population) {
                        setCellData(row, 'flora', 'population', trend, flora);
                    }
                    if (trend in flora.mature) {
                        setCellData(row, 'flora', 'mature', trend, flora);
                    }
                    if (trend in fauna.population) {
                        setCellData(row, 'fauna', 'population', trend, fauna);
                    }
                    if (trend in fauna.mature) {
                        setCellData(row, 'fauna', 'mature', trend, fauna);
                    }
                    if (trend in communities.occurrence) {
                        setCellData(row, 'communities', 'occurrence', trend, communities);
                    }
                    if (trend in communities.aoo) {
                        setCellData(row, 'communities', 'aoo', trend, communities);
                    }
                    return row;
                })
                .value();
        },

        getSummaryContentElement: function () {
            return $('#summary_content_' + this.id);
        },

        getSummaryTableElement: function () {
            return $('#summary_table_' + this.id);
        },

        getDetailsContentElement: function () {
            return $('#details_content_' + this.id);
        },

        getDetailsTableElement: function () {
            return $('#details_table_' + this.id);
        },

        renderSpecies: function (models) {
            var columnDefs = [
                    {
                        title: 'Taxon',
                        data: 'id'
                    },
                    {
                        title: 'Common Name',
                        data: 'name'
                    }
                ],
                tableOptions = {
                    'destroy': true
                },
                table = tables.initTable(this.getDetailsTableElement(), tableOptions, columnDefs),
                rows = _.map(models, function (m){
                    return {
                        id: m.id(),
                        name: m.name()
                    }
                });
            table.clear();
            table.populate(rows);
        },

        renderCommunities: function (models) {
            var columnDefs = [
                    {
                        title: 'Community ID',
                        data: 'id'
                    },
                    {
                        title: 'Community Name',
                        data: 'name'
                    }
                ],
                tableOptions = {
                    'destroy': true
                },
                table = tables.initTable(this.getDetailsTableElement(), tableOptions, columnDefs),
                rows = _.map(models, function (m){
                    return {
                        id: m.id(),
                        name: m.name()
                    }
                });
            table.clear();
            table.populate(rows);
        },

        clearDetails: function () {
            this.getDetailsContentElement().html('');
        },

        /*
         id should be something like fauna_population_<trend>
         */
        renderDetails: function (id, model) {
            var split = id.split('_'),
                data = split[0],
                type = split[1],
                trend = split[2],
                renderSpecies = _.bind(this.renderSpecies, this),
                renderCommunities = _.bind(this.renderCommunities, this),
                getDetailsTableElement = _.bind(this.getDetailsTableElement, this),
                label = 'Trend: ' + trend + ' for ' + data + ' ' + type,
//                label = '',
                template = _.template(detailsTemplate)({
                    id: this.id,
                    label: label
             });

            this.getDetailsContentElement().html(template);
            model.onReady(function (records) {
                var models = records[data][type][trend].models;
                if (data === 'fauna' || data === 'flora') {
                    renderSpecies(models);
                }
                if (data === 'communities') {
                    renderCommunities(models);
                }
                $.scrollTo(getDetailsTableElement(), 0);
            });
        }
    });
});