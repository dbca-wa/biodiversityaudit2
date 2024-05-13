define([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'dataSources'
], function ($, _, Backbone, config, dataSources) {

    return Backbone.Model.extend({

        id: function () {
            return this.get('SUB_CODE');
        },

        name: function () {
            return this.get('REG_NAME');
        },

        initialize: function () {
            this.set("spatial_profile_url", this.getSpatialProfileURL());
            dataSources.fauna.onReady(_.bind(this.setFaunaRecords, this));
            dataSources.flora.onReady(_.bind(this.setFloraRecords, this));
            dataSources.communities.onReady(_.bind(this.setCommunitiesRecords, this));
            dataSources.wetlands.onReady((_.bind(this.setWetlandsRecords, this)));
        },

        /*
         Construct the URL for the regional profile PDF.
        E.g. http://static.dbca.wa.gov.au/static/biodiversityaudit/Sub-Region-Profile-Reporting-Tables-LSD02.pdf
        DBCA CDN: config.ckan.static_url
        Base filename: Sub-Region-Profile-Reporting-Tables-
        spatial_profile_basename: DBCA CDN + Base filename (as per config.js)
        Schema: DBCA CDN + Base filename + "SUB_CODE" + ".pdf"
         */
        getSpatialProfileURL: function () {
            // parse the popup attribute for a href that contains the ckan url
            // var node = $('<div>' + this.get('popup') + '</div>');
            // var href = node.find('a[href*="').attr('href');
            return config.urls.spatial_profile_basename + this.id() + '.pdf';
        },

        setFaunaRecords: function (collection, allRecords) {
            var regionCode = this.get('SUB_CODE');
            var myRecordsBySpecies = _(allRecords)
                .filter(function (r) {
                    return r.get('SCALE') === regionCode;
                })
                .groupBy(function (r) {
                    return r.get('NAMESCIEN');
                })
                .value();
            this.set('fauna', myRecordsBySpecies);
        },

        setFloraRecords: function (collection, allRecords) {
            var regionCode = this.get('SUB_CODE');
            var myRecordsBySpecies = _(allRecords)
                .filter(function (r) {
                    return r.get('SCALE') === regionCode;
                })
                .groupBy(function (r) {
                    return r.get('NAMESCIEN');
                })
                .value();
            this.set('flora', myRecordsBySpecies);
        },

        setCommunitiesRecords: function (collection, allRecords) {
            var regionCode = this.get('SUB_CODE');
            var recordsByCommunity = _(allRecords)
                .filter(function (r) {
                    return r.get('SCALE') === regionCode;
                })
                .groupBy(function (r) {
                    return r.get('COMMUNITYID');
                })
                .value();
            this.set('communities', recordsByCommunity);
        },

        setWetlandsRecords: function (collection, allRecords) {
            var regionCode = this.get('SUB_CODE');
            var myRecordsBySpecies = _(allRecords)
                .filter(function (r) {
                    return r.get('SCALE') === regionCode;
                })
                .groupBy(function (r) {
                    return r.get('???????');
                })
                .value();
            this.set('wetlands', myRecordsBySpecies);
        }

    });
});