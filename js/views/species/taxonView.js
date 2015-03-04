define([
    'jquery',
    'underscore',
    'backbone',
    'views/region/faunaView',
    'text!templates/species/summaryTemplate.html'
], function ($, _, Backbone, FaunaView, summaryTemplate) {

    // very similar to the fauna view in region, except that taxon=region

    return FaunaView.extend({
        el: '#taxonTab',

        initialize: function (options) {
            console.log('init with', options);
            this.label = options.label || "";
            this.columnDefinitions[0]['title'] = 'Region';
            // clear previous tables
            this.$el.find('summary_content').html('');
            this.$el.find('details_content').html('');
        },

        buildSummaryContent: function () {
            var values = {label: this.label || ""};
            return _.template(summaryTemplate)(values);
        }
    });
});