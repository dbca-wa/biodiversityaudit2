define([
    'jquery',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'views/tableView',
    'text!templates/cells/region/threats.html'
], function ($, _, Backbone, tables, filters, TableView, threatsCellTemplate) {

    return Backbone.View.extend({

        el: '#fauna_summary',

        speciesTemplate: _.template(
            '<%= species %>'
        ),
        threatsTemplate: _.template(threatsCellTemplate),
        trendsTemplate: _.template(
            '<a  id="trends_<%= species %>">click for details</a>'
        ),
        statusTemplate: _.template(
            '<%= status %>'
        ),
        managementTemplate: _.template(
            '<a id="management_<%= species %>">click for details</a>'
        ),

        columnDefinitions: [
            {
                title: 'Species',
                width: '0%',
                data: 'species',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Threats',
                width: '0%',
                data: 'threats',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Status',
                width: '0%',
                data: 'status',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Trends',
                data: 'trends',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Management Required',
                width: '0%',
                data: 'management',
                render: function (data) {
                    return data.rendered
                }
            }
        ],


        buildRowData: function (records, speciesName) {

            function buildThreatsData() {
                var pastCount = 0,
                    futureCount = 0;
                _.each(records, function (r) {
                    var past = r.get('TT_PASTPRESSURES_CAT');
                    var fut = r.get('TT_FUTURETHREATS_CAT');
                    if (filters.notEmpty(past)) {
                        past = past.toLowerCase();
                        if (_.contains(past, 'unknown')) {
                            pastCount = '??';
                        } else if (_.contains(past, 'no known')) {
                            pastCount = 0; //'No known';
                        } else {
                            pastCount += 1;
                        }
                    }
                    if (filters.notEmpty(fut)) {
                        fut = fut.toLowerCase();
                        if (_.contains(fut, 'unknown')) {
                            futureCount = 'unknown';
                        } else if (_.contains(fut, 'no known')) {
                            futureCount = 0; //'No known';
                        } else {
                            futureCount += 1;
                        }
                    }
                });

                return {
                    species: speciesName,
                    pastCount: pastCount,
                    futureCount: futureCount
                }
            }

            function getStatus() {
                var filter = _(records)
                    .filter(function (r) {
                        return filters.notEmpty(r.get('TT_STATUSWA'))
                    }).value();
                if (filter.length > 0) {
                    return filter[0].get('TT_STATUSWA');
                } else {
                    return ''; //'?????';
                }
            }

            var species = {
                    rendered: this.speciesTemplate({species: speciesName})
                },
                threats = {
                    rendered: this.threatsTemplate(buildThreatsData())
                },
                trends = {
                    rendered: this.trendsTemplate({species: speciesName})
                },
                status = {
                    rendered: this.statusTemplate({status: getStatus()})
                },
                management = {
                    rendered: this.managementTemplate({species: speciesName})
                };

            return {
                species: species,
                threats: threats,
                trends: trends,
                status: status,
                management: management
            };

        },


        initialize: function () {
            _.bindAll(this, 'render');
        },

        render: function () {
            if (this.model) {
                var table = tables.initTable(this.el, {}, this.columnDefinitions);
                var buildRow = _.bind(this.buildRowData, this);
                var rows = _(this.model)
                    .map(function (v, k) {
                        return buildRow(v, k);
                    })
                    .value();
                var el = this.el;
                var renderDetails = _.bind(this.renderDetails, this);
                //bind details links (should be done with the router)
                table.on('draw.dt', function () {
                    $(el).find('tr a').on('click', function (e) {
                        var split = e.target.id.split('_');
                        renderDetails(split[0], split[1]);
                    });

                });
                table.populate(rows);
            }
        },

        renderDetails: function (type, species) {
            var records = this.model[species];
            this.resetDetails();
            if (type == 'threats') {
                this.renderThreatDetails(species, records);
            }
            else if (type === 'trends') {

            }
            else if (type === 'management') {

            }
            else {
                console.error('No details for type:', type)
            }

        },

        resetDetails: function () {
            var container = $('#details_content');
            container.empty();
            container.html('<table class="table display" id="details_table"></table>');
        },

        renderThreatDetails: function (species, records) {
            var fields = ['TT_PASTPRESSURES_CAT', 'TT_PASTPRESSURES_SPECIFY', 'TT_FUTURETHREATS_CAT',
                'TT_FUTURETHREATS_SPECIFY', 'TT_RECOVERYPLANCOMMENCE'];
            var view = new TableView({
                id: 'details_table',
                model: records,
                fields: fields,
                filters: [
                    {
                        field: '__one__',
                        predicate: filters.notEmpty
                    }
                ]
            });

            view.render();
        }
    });


});