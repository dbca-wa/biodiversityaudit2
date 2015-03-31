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

        columnDefs: [
            {
                title: "Trend",
                data: "trend"
            },
            {
                title: "Number of populations",
                data: "flora.population.count"
            },
            {
                title: "Number of mature individuals",
                data: "flora.mature.count"
            },
            {
                title: "Number of populations",
                data: "fauna.population.count"
            },
            {
                title: "Number of mature individuals",
                data: "fauna.mature.count"

            },
            {
                title: "Number of occurrences",
                data: "communities.occurrence.count"
            },
            {
                title: "Area of occupancy",
                data: "communities.aoo.count"
            }
        ],

        initialize: function () {
            this.model = new Model();
        },

        render: function (parent) {
            var child = _.template(template)({parent: parent, id: this.id, title: this.title, description: this.description});
            $("#" + parent).append(child);

            var table = tables.initTable('#summary_table_' + this.id, {paging:false}, this.columnDefs);

            var buildRows = _.bind(this.buildRows, this);
            this.model.onReady(function (records) {
                var rows = buildRows(records);
                table.populate(rows);
                console.log('rows', rows);
            });

        },

        cellTemplate: _.template(
            '<a title="click to view details." id="<%= id %>" href=""><%= count %></a></span>'
        ),

        /*
        id should be something like fauna_population_<trend>
         */
        showDetails: function(id) {
            function showSpecies (species){
                console.log('showSpecies', species);
            }
            function showCommunities (communities){
                console.log("showCommunities", communities);
            }

            this.model.onReady(function (records){
                var split = id.split('_');
                var data = split[0];
                var type = split[1];
                var trend = split[2];
                var models = records[data][type][trend].models;
                if (type === 'fauna' || type === 'flora'){
                    showSpecies(models);
                }
                if (type === 'communities') {
                    showCommunities(models)
                }
            });

        },

        /*
        Reformat data from model to accommodate the table rows definition
         */
        buildRows: function (records) {
            // build a list of unique trends
            var trends = _([])
                .union(_.keys(records.fauna['population']))
                .union(_.keys(records.fauna['mature']))
                .union(_.keys(records.flora['population']))
                .union(_.keys(records.flora['mature']))
                .union(_.keys(records.communities['occurrence']))
                .union(_.keys(records.communities['occurrence']))
                .value();
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
                    if (trend in flora.population) {
                        row.flora.population = flora.population[trend];
                    }
                    if (trend in flora.mature) {
                        row.flora.mature = flora.mature[trend];
                    }
                    if (trend in fauna.population) {
                        row.fauna.population = fauna.population[trend];
                    }
                    if (trend in fauna.mature) {
                        row.fauna.mature = fauna.mature[trend];
                    }
                    if (trend in communities.occurrence) {
                        row.communities.occurrence = communities.occurrence[trend];
                    }
                    if (trend in communities.aoo) {
                        row.communities.aoo = communities.aoo[trend];
                    }
                    return row;
                })
                .value();
        }


    });


});