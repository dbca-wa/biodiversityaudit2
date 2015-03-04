define([
    'jquery',
    'underscore',
    'backbone',
    '../../app/tableFacade',
    'app/filters',
    'views/tableView',
    'text!templates/region/summaryDefaultTemplate.html',
    'text!templates/region/detailsDefaultTemplate.html',
    'text!templates/region/threatsSummaryTemplate.html'
], function ($, _, Backbone, tables, filters, TableView, summaryTemplate, detailsTemplate, threatsCellTemplate) {

    return Backbone.View.extend({

        el: '#faunaTab',

        speciesTemplate: _.template(
            '<span class="taxa"><%= species %></span>'
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
                title: 'Taxon',
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
                this.renderSummary()
            }
        },

        renderSummary: function () {
            this.setSummaryContent(this.buildSummaryContent());
            var tableSelector = this.getSummaryTableElement();
            var table = tables.initTable(tableSelector, {}, this.columnDefinitions);
            var buildRow = _.bind(this.buildRowData, this);
            var rows = _(this.model)
                .map(function (v, k) {
                    return buildRow(v, k);
                })
                .value();
            var renderDetails = _.bind(this.renderDetails, this);
            //bind details links (should be done with the router)
            table.on('draw.dt', function () {
                $(tableSelector).find('tr a').on('click', function (e) {
                    var split = e.target.id.split('_');
                    renderDetails(split[0], split[1]);
                });

            });
            table.populate(rows);
        },

        buildSummaryContent: function () {
            var values = {label: this.label || ""};
            return _.template(summaryTemplate)(values);
        },

        renderDetails: function (type, species) {
            var records = this.model[species];
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

        setSummaryContent: function (html) {
            var container = this.$el.find('#summary_content');
            container.html(html);
            return container;
        },

        getSummaryContentElement: function () {
            return this.$el.find('#summary_content');
        },

        getSummaryTableElement: function () {
            return this.getSummaryContentElement().find('#summary_table');
        },

        getDetailsContentElement: function () {
            return this.$el.find('#details_content');
        },

        getDetailsTableElement: function () {
            return this.getDetailsContentElement().find('#details_table');
        },

        setDetailsContent: function (html) {
            var container = this.getDetailsContentElement();
            container.html(html);
            return container;
        },

        renderThreatDetails: function (species, records) {
            var tableFields = ['TT_PASTPRESSURES_CAT', 'TT_PASTPRESSURES_SPECIFY', 'TT_FUTURETHREATS_CAT',
                'TT_FUTURETHREATS_SPECIFY', 'TT_RECOVERYPLANCOMMENCE'];
            var tableElement = this.getDetailsTableElement();
            var tableView = new TableView({
                el: tableElement.selector,
                model: records,
                fields: tableFields,
                filters: [
                    {
                        field: '__one__',
                        predicate: filters.notEmpty
                    }
                ]
            });
            var compiled = _.template(detailsTemplate);
            var table;
            this.setDetailsContent(compiled({type: 'Threats', species: species}));
            table = tableView.render();
            // reverse order to put blank line at the end
            table.order([0,'desc']).draw();
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
                    title: 'Trend Type',
                    data: 'type',
                    width: '5%',
                    orderable: false
                },
                {
                    title: 'Raw #',
                    width: '5%',
                    data: 'raw'
                },
                {
                    title: '# Translocated',
                    width: '5%',
                    data: 'trans'
                },
                {
                    title: 'Trend',
                    width: '10%',
                    data: 'trend'
                },
                {
                    title: 'Trend Reliability',
                    width: '20%',
                    data: 'reliability'
                },
                {
                    title: 'Notes',
                    data: 'notes'
                }

            ];
            var compiled = _.template(detailsTemplate);
            this.setDetailsContent(compiled({type: 'Trends', species: species}));
            var table = tables.initTable(this.getDetailsTableElement(), {paging: false, info: false, searching: false, ordering: false}, columnDefs);

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
                    type: 'Direct Intervention',
                    category: getNotEmptyValues('TT_MANREQ_DIRECT_CAT'),
                    comment: getNotEmptyValues('TT_MANREQ_DIRECT_SPECIFY')
                };
            }

            function buildIndirectRow() {
                return {
                    type: 'Indirect Intervention',
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
                    width:'15%'
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
                }
            ];

            var compiled = _.template(detailsTemplate);
            this.setDetailsContent(compiled({type: 'Management', species: species}));
            var table = tables.initTable(this.getDetailsTableElement(), {paging: false, info: false, searching: false, ordering: false}, columnDefs);

            table.populate([buildResearchRow(), buildEvalRow(), buildPlanningRow(), buildDirectRow(), buildIndirectRow(), buildOtherRow()]);

        }

    });


});