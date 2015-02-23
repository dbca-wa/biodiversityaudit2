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
            '<a  id="trends_<%= species %>">details</a>'
        ),
        statusTemplate: _.template(
            '<%= status %>'
        ),
        managementTemplate: _.template(
            '<a id="management_<%= species %>">details</a>'
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
                this.renderTrendsDetails(species, records);
            }
            else if (type === 'management') {
                this.renderManagementDetails(species, records);
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
        },

        renderTrendsDetails: function (species, records) {
            function getValue(column, def) {
                var vals = getValues(column);
                var result = vals[0] || def || '';
                if (vals.length == 0) {
//                    console.error("No value for ", column, ".Species:", species);
                }
                else if (vals.length > 1) {
                    console.error("More than one value for ", column, vals, ".Species:", species);
                }
                return result;
            }

            function getValues(column) {
                return _(records)
                    .map(function (r) {
                        return r.get(column);
                    })
                    .filter(function (val) {
                        return filters.notEmpty(val);
                    })
                    .value()
            }

            function buildESURow() {
                return {
                    type: 'ESU',
                    raw: getValue('TT_KNOWNESU_NUM'),
                    trans: 'N/A',
                    trend: getValue('TT_KNOWNESU_TREND'),
                    reliability: getValue('TT_KNOWNESU_TRENDRELIAB'),
                    notes: getValue('TT_KNOWNESU_NOTES'),
                    IUCN: 'N/A'
                };

            }

            function buildPopRow() {
                return {
                    type: 'Pop',
                    raw: getValue('TT_KNOWNPOPS_NUM'),
                    trans: getValue('TT_KNOWNPOPS_TRANS'),
                    trend: getValue('TT_KNOWNPOPS_TREND'),
                    reliability: getValue('TT_KNOWNPOPS_TRENDRELIAB'),
                    notes: getValue('TT_KNOWNPOPS_NOTES'),
                    IUCN: getValue('TT_KNOWNPOPS_CAT')
                };

            }

            function buildIndRow() {
                return {
                    type: '# Ind',
                    raw: getValue('TT_MATIND_RAW'),
                    trans: 'N/A',
                    trend: getValue('TT_MATIND_TREND'),
                    reliability: getValue('TT_MATIND_TRENDRELIAB'),
                    notes: getValue('TT_MATIND_NOTES'),
                    IUCN: getValue('TT_MATIND_CAT')
                };

            }

            function buildEOORow() {
                return {
                    type: 'EOO',
                    raw: getValue('TT_EOOAREA_RAW'),
                    trans: 'N/A',
                    trend: getValue('TT_EOOAREA_TREND'),
                    reliability: 'N/A',
                    notes: getValue('TT_EOOAREA_NOTES'),
                    IUCN: getValue('TT_EOOAREA_CAT')
                };

            }

            function buildAOORow() {
                return {
                    type: 'AOO',
                    raw: getValue('TT_AOOAREA_RAW'),
                    trans: 'N/A',
                    trend: getValue('TT_AOOAREA_TREND'),
                    reliability: 'N/A',
                    notes: getValue('TT_AOOAREA_NOTES'),
                    IUCN: getValue('TT_AOOAREA_CAT')
                };

            }

            var columnDefs = [
                {
                    title: '',
                    data: 'type',
                    orderable: false
                },
                {
                    title: 'Raw #',
                    data: 'raw'
                },
                {
                    title: 'Trans',
                    data: 'trans'
                },
                {
                    title: 'Trend',
                    data: 'trend'
                },
                {
                    title: 'Trend Reliability',
                    data: 'reliability'
                },
                {
                    title: 'Notes',
                    data: 'notes'
                },
                {
                    title: 'IUCN',
                    data: 'IUCN'
                },

            ];
            var table = tables.initTable('#details_table', {paging: false, info: false, searching: false, ordering: false}, columnDefs);

            table.populate([buildESURow(), buildPopRow(), buildIndRow(), buildEOORow(), buildAOORow()]);
        },

        renderManagementDetails: function (species, records) {

            function getNotEmptyValues(column) {
                return _(records)
                    .map(function (r) {
                        return r.get(column);
                    })
                    .filter(function (val) {
                        return filters.notEmpty(val);
                    })
                    .value();
            }

            function renderAsList(values) {
                var compiled = _.template('<ul><% _.forEach(values, function(value) { %><li><%- value %></li><% }); %></ul>');
                return compiled({ values: values });
            }

            function buildResearchRow() {
                return {
                    type: 'Research',
                    category: getNotEmptyValues('TT_MANREQ_RESEARCH_CAT'),
                    comment: getNotEmptyValues('TT_MANREQ_RESEARCH_SPECIFY')
                };
            }

            function buildEvalRow() {
                return {
                    type: 'Evaluation',
                    category: getNotEmptyValues('TT_MANREQ_EVALUATION_CAT'),
                    comment: getNotEmptyValues('TT_MANREQ_EVALUATION_SPECIFY')
                };
            }

            function buildPlanningRow() {
                return {
                    type: 'Conservation Planning',
                    category: getNotEmptyValues('TT_MANREQ_CONSPLAN_CAT'),
                    comment: getNotEmptyValues('TT_MANREQ_CONSPLAN_SPECIFY')
                };
            }

            function buildDirectRow() {
                return {
                    type: 'Direct',
                    category: getNotEmptyValues('TT_MANREQ_DIRECT_CAT'),
                    comment: getNotEmptyValues('TT_MANREQ_DIRECT_SPECIFY')
                };
            }

            function buildIndirectRow() {
                return {
                    type: 'Indirect',
                    category: getNotEmptyValues('TT_MANREQ_INDIRECT_CAT'),
                    comment: getNotEmptyValues('TT_MANREQ_INDIRECT_SPECIFY')
                };
            }

            function buildOtherRow() {
                return {
                    type: 'Other',
                    category: getNotEmptyValues('TT_MANREQ_OTHER_CAT'),
                    comment: getNotEmptyValues('TT_MANREQ_OTHER_SPECIFY')
                };
            }

            var columnDefs = [
                {
                    title: 'Type',
                    data: 'type',
                },
                {
                    title: 'Category',
                    data: 'category',
                    render: function (data) {
                        return renderAsList(data)
                    }
                },
                {
                    title: 'Comment',
                    data: 'comment',
                    render: function (data) {
                        return renderAsList(data)
                    }
                },
            ];
            var table = tables.initTable('#details_table', {paging: false, info: false, searching: false, ordering: false}, columnDefs);

            table.populate([buildResearchRow(), buildEvalRow(), buildPlanningRow(), buildDirectRow(), buildIndirectRow(), buildOtherRow()]);

        }

    });


});