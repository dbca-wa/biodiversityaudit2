define([
    'jquery',
    'underscore',
    'backbone',
    '../../app/tableFacade',
    'app/filters',
    'views/tableView',
    'text!templates/assets/assetsSummaryTemplate.html',
    'text!templates/region/detailsDefaultTemplate.html',
    'text!templates/region/threatsSummaryTemplate.html',
    'views/region/faunaSummaryView'
], function ($, _, Backbone, tables, filters, TableView, summaryTemplate, detailsTemplate, threatsCellTemplate, FaunaSummaryView) {

    /*
        Very similar to the fauna view in region, except that the first column is the region instead of the taxon
     */
    return FaunaSummaryView.extend({
        el: '#result_content',

        idTemplate: _.template(
            '<span><a title="click to view regional information." href="#regions/species/<%- id %>"><%= id %></a></span>'
        ),

        columnDefinitions: [
            {
                title: 'Subregion',
                width: '12vw',
                data: 'id',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'DPaW Region',
                width: '12vw',
                data: 'dpawRegion',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Threats',
                width: '25vw',
                data: 'threats',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Status WA',
                width: '11vw',
                data: 'status',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Trends',
                data: 'trends',
                width: '11vw',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Management Requirement',
                width: '11vw',
                data: 'management',
                render: function (data) {
                    return data.rendered
                }
            }
        ],

        initialize: function (options) {
            this.label = options.label || "";
        },

        buildSummaryContent: function () {
            var values = {label: this.label || ""};
            return _.template(summaryTemplate)(values);
        },

        buildSummaryRow: function (records, id) {
            var id_ = {
                    rendered: this.idTemplate({id: id})
                },
                name = {
                    rendered: this.nameTemplate({name: records[0].get('NAMECOMMON')})
                },
                dist = {
                    rendered: this.distTemplate({value: this.getDistribution(records)})
                },
                dpawRegion = {
                    rendered: this.statusTemplate({status: records[0].get('DPAWREGION')})
                },
                threats = {
                    rendered: this.threatsTemplate(_.extend({id: id}, this.buildSummaryThreats(records)))
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
                dist: dist,
                dpawRegion: dpawRegion,
                threats: threats,
                trends: trends,
                status: status,
                management: management
            };

        }

    });

});