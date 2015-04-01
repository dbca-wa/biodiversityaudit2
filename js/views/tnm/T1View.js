define([
    'jquery',
    'jqueryScrollTo',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'dataSources',
    'models/tnm/T1Model',
    'text!templates/tnm/T1Template.html',
    'text!templates/tnm/detailsDefaultTemplate.html'
], function ($, scrollTo, _, Backbone, tables, filters, dataSources, Model, template, detailsTemplate) {

    return Backbone.View.extend({
        id: 'T1',
        el: '#content_panel_T1',
        title: "Trend by biodiversity asset (measures of change in condition over time).",
        description: "This question cumulatively addresses questions regarding which biodiversity assets have increased/decreased/remained static and why and provides counts and totals (from which it is possible to then display graphically and or as proportions) for either whole of State or individual subregions.  For species, the most informative metrics are numbers of populations and mature individuals whereas for ecological communities these are number of occurrences and area of occupancy.",

        columnDefs: [
            {
                title: "Trend",
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

        initialize: function () {
            this.model = new Model();
        },

        render: function (parent) {
            var child = _.template(template)({parent: parent, id: this.id, title: this.title, description: this.description}),
                tableOptions = {
                    'paging': false,
                    'searching': false
                },
                table,
                buildRows = _.bind(this.buildRows, this),
                renderDetails = _.bind(this.renderDetails, this);
            $("#" + parent).append(child);
            table = tables.initTable(this.getSummaryTableElement(), tableOptions, this.columnDefs);
            // bind the links to the renderDetails method
            table.on('draw.dt', function (e) {
                $(e.target).find("td a").on('click', function (e) {
                    renderDetails(e.target.id);
                });
            });
            this.model.onReady(function (records) {
                var rows = buildRows(records);
                table.populate(rows);
                console.log("T1, loaded");
            });
        },

        cellTemplate: _.template(
            '<a title="click to view details." id="<%= id %>"><%= val %></a></span>'
        ),

        /*
         Reformat data from model to accommodate the table rows definition
         */
        buildRows: function (records) {
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
            var cellTemplate = this.cellTemplate;
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

        speciesColDefs: [
            {
                title: 'Taxon',
                data: 'id'
            },
            {
                title: 'Common Name',
                data: 'name'
            }
        ],

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

        /*
         id should be something like fauna_population_<trend>
         */
        renderDetails: function (id) {
            var split = id.split('_'),
                data = split[0],
                type = split[1],
                trend = split[2],
                renderSpecies = _.bind(this.renderSpecies, this),
                renderCommunities = _.bind(this.renderCommunities, this),
                detailsTable = this.getDetailsTableElement();


            this.model.onReady(function (records) {
                var models = records[data][type][trend].models;
                if (data === 'fauna' || data === 'flora') {
                    renderSpecies(models);
                }
                if (data === 'communities') {
                    renderCommunities(models);
                }
                $.scrollTo(detailsTable, 0);
            });
        }
    });
});