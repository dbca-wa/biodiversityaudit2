define([
    'jquery',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'views/tableView'
], function ($, _, Backbone, tables, filters, TableView) {

    var View = Backbone.View.extend({

        el: '#fauna_summary',

        speciesTemplate: _.template(
            '<%= species %>'
        ),
        threatsTemplate: _.template(
            '<a id="threats_<%= species %>">click for details</a>'
        ),
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
                data: 'species',
                render: function (data, type, row, meta) {
                    return data.rendered
                }
            },
            {
                title: 'Threats',
                data: 'threats',
                render: function (data, type, row, meta) {
                    return data.rendered
                }
            },
            {
                title: 'Trends',
                data: 'trends',
                render: function (data, type, row, meta) {
                    return data.rendered
                }
            },
            {
                title: 'Status',
                data: 'status',
                render: function (data, type, row, meta) {
                    return data.rendered
                }
            },
            {
                title: 'Management Required',
                data: 'management',
                render: function (data, type, row, meta) {
                    return data.rendered
                }
            }
        ],


        buildRowData: function (records, speciesName) {

            function getStatus() {
                var filter = _(records)
                    .filter(function (r) {
                        return filters.notEmpty(r.get('TT_STATUSWA'))
                    }).value();
                if (filter.length > 0) {
                    return filter[0].get('TT_STATUSWA');
                } else {
                    return '?????';
                }
            }

            var species = {
                    rendered: this.speciesTemplate({species: speciesName})
                },
                threats = {
                    rendered: this.threatsTemplate({species: speciesName})
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


        initialize: function (options) {
            _.bindAll(this, 'render');
        },

        render: function () {
            if (this.model) {
                var table = tables.initTable(this.el, {}, this.columnDefinitions);
                var buildRow = _.bind(this.buildRowData, this);
                var rows = _(this.model)
                    .map(function (v, k, c) {
                        return buildRow(v, k);
                    })
                    .value();
                var el = this.el;
                var renderDetails = _.bind(this.renderDetails, this);
                //bind details links (should be done with the router)
                table.on('draw.dt', function (e, settings) {
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
//            console.log('render', type, species, records);
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
            var fields = ['TT_PASTPRESSURES_CAT','TT_PASTPRESSURES_SPECIFY','TT_FUTURETHREATS_CAT','TT_FUTURETHREATS_SPECIFY','TT_RECOVERYPLANCOMMENCE'];
            var model = records;
            var view = new TableView({
                id: 'details_table',
                model: model,
                fields: fields,
                filters: [
                    {
                        field: '__one__',
                        predicate: filters.notEmpty
                    }
                ]
            });

            view.render();
        },

        renderTrendsDetails: function (species, records) {

        }


    });

    return View;


});