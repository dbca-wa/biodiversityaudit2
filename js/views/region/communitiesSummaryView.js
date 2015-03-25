define([
    'jquery',
    'underscore',
    'backbone',
    '../../app/tableFacade',
    'app/filters',
    'views/region/faunaSummaryView',
    'text!templates/region/summaryDefaultTemplate.html',
    'text!templates/region/detailsDefaultTemplate.html',
    'text!templates/region/threatsSummaryTemplate.html'
], function ($, _, Backbone, tables, filters, FaunaSummaryView, summaryTemplate, detailsTemplate, threatsCellTemplate) {

    return FaunaSummaryView.extend({
        el: '#communitiesTab',

        columnDefinitions: [
            {
                title: 'Community ID',
                width: '10vw',
                data: 'id',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Community Name',
                width: '40vw',
                data: 'name',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Threats',
                width: '12.5vw',
                data: 'threats',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Status WA',
                width: '12.5vw',
                data: 'status',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Trends',
                data: 'trends',
                width: '12.5vw',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Management Requirement',
                width: '12.5vw',
                data: 'management',
                render: function (data) {
                    return data.rendered
                }
            }
        ],

        idTemplate: _.template(
            '<span class="taxa"><a title="click to view asset information." href="#assets/community/<%- id %>"><%= id %></a></span>'
        ),
        nameTemplate: _.template(
            '<span><%= name %></span>'
        ),
        threatsTemplate: _.template(threatsCellTemplate),
        trendsTemplate: _.template(
            '<a  id="trends_<%= id %>">details</a>'
        ),
        statusTemplate: _.template(
            '<%= status %>'
        ),
        managementTemplate: _.template(
            '<a id="management_<%= id %>">details</a>'
        ),

        buildSummaryRow: function (records, id) {
            var id_ = {
                    rendered: this.idTemplate({id: id})
                },
                name = {
                    rendered: this.nameTemplate({name: records[0].get('COMMUNITYNAME')})
                },
                threats = {
                    rendered: this.threatsTemplate(_.extend({id: id},this.buildSummaryThreats(records)))
                },
                trends = {
                    rendered: this.trendsTemplate({id: id})
                },
                status = {
                    rendered: this.statusTemplate({status: this.getStatusWA(records)})
                },
                management = {
                    rendered: this.managementTemplate({id: id})
                };

            return {
                id: id_,
                name: name,
                threats: threats,
                trends: trends,
                status: status,
                management: management
            };
        },

        renderTrendsDetails: function (id, records) {
            function getValue(column, def) {
                var vals = getValues(column);
                var result = vals[0] || def || '';
                if (vals.length > 1) {
                    console.error("More than one value for ", column, vals, ".Species:", id);
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

            function buildOccurrenceRow() {
                return {
                    type: 'Occurrence',
                    raw: getValue('KNOWNOCC_NUM'),
                    degree: 'N/A',
                    severity: 'N/A',
                    trend: getValue('KNOWNOCC_TREND'),
                    reliability: getValue('KNOWNOCC_TRENDRELIAB'),
                    notes: getValue('KNOWNOCC_NOTES')
                };

            }

            function buildAbioticRow() {
                return {
                    type: 'Abiotic',
                    raw: 'N/A',
                    degree: getValue('DEGABIOTIC_EXTENTCAT'),
                    severity: getValue('DEGABIOTIC_SEVERITYCAT'),
                    trend: getValue('DEGABIOTIC_SEVERITYTREND'),
                    reliability: getValue('DEGABIOTIC_RELIAB'),
                    notes: getValue('DEGABIOTIC_NOTES')
                };
            }

            function buildBioticRow() {
                return {
                    type: 'Biotic',
                    raw: 'N/A',
                    degree: getValue('DEGBIOTIC_EXTENTCAT'),
                    severity: getValue('DEGBIOTIC_SEVERITYCAT'),
                    trend: getValue('DEGBIOTIC_SEVERITYTREND'),
                    reliability: getValue('DEGBIOTIC_RELIAB'),
                    notes: getValue('DEGBIOTIC_NOTES')
                };
            }

            function buildEOORow() {
                return {
                    type: 'EOO',
                    raw: getValue('EOOAREA_RAW'),
                    degree: 'N/A',
                    severity: 'N/A',
                    trend: getValue('EOOAREA_TREND'),
                    reliability: 'N/A',
                    notes: getValue('EOOAREA_NOTES')
                };
            }

            function buildAOORow() {
                return {
                    type: 'AOO',
                    raw: getValue('AOOAREA_RAW'),
                    degree: 'N/A',
                    severity: 'N/A',
                    trend: getValue('AOOAREA_TREND'),
                    reliability: 'N/A',
                    notes: getValue('AOOAREA_NOTES')
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
                    title: 'Degree of Degradation',
                    width: '10%',
                    data: 'degree'
                },
                {
                    title: 'Severity of Degradation',
                    width: '10%',
                    data: 'severity'
                },
                {
                    title: 'Trend',
                    width: '12%',
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
            this.setDetailsContent(compiled({type: 'Trends', id: id}));
            var table = tables.initTable(this.getDetailsTableElement(), {paging: false, info: false, searching: false, ordering: false}, columnDefs);

            table.populate([buildOccurrenceRow(), buildEOORow(), buildAOORow(), buildAbioticRow(), buildBioticRow()]);

            // add foot note
            var html =
                'EOO: Extent Of Occurrence  &nbsp;&nbsp;&nbsp;' +
                'AOO: Area Of Occupancy';
            this.$el.find('#details_footer').html(html);
        }


    });


});