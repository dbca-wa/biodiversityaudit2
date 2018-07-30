define([
    'jquery',
    'underscore',
    'backbone',
    'views/region/communitiesSummaryView',
    'text!templates/assets/assetsSummaryTemplate.html'
], function ($, _, Backbone, RegionCommunityView, summaryTemplate) {

    /* Very similar to the one in region
     */
    return RegionCommunityView.extend({
        el: '#result_content',

        idTemplate: _.template(
            '<span><a title="click to view regional information." href="#regions/community/<%- id %>"><%= id %></a></span>'
        ),

        columnDefinitions: [
            {
                title: 'Subregion',
                width: '10vw',
                data: 'id',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'DPaW Region',
                width: '10vw',
                data: 'dpawRegion',
                render: function (data) {
                    return data.rendered
                }
            },
            {
                title: 'Community Name',
                width: '30vw',
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
                title: 'Management Options',
                width: '12.5vw',
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
                }
                dpawRegion = {
                    rendered: this.statusTemplate({status: records[0].get('DPAWREGION')})
                };

            return {
                id: id_,
                name: name,
                threats: threats,
                trends: trends,
                status: status,
                management: management,
                dpawRegion: dpawRegion
            };
        },


    });

});