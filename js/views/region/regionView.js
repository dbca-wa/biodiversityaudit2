define([
    'jquery',
    'underscore',
    'backbone',
    'bootstrap',
    'text!templates/region/regionTemplate.html',
    'views/region/faunaSummaryView',
    'views/region/floraSummaryView',
    'views/region/communitiesSummaryView',
], function ($, _, Backbone, bootstrap, template, FaunaSummaryView, FloraSummaryView, CommunitiesSummaryView) {


    var View = Backbone.View.extend({

        el: '#region_content',

        compiled: _.template(template),

        initialize: function (options) {
            _.bindAll(this, 'render', 'renderFauna');
            if (this.model) {
                this.model.on('change:fauna', this.renderFauna, this);
                this.model.on('change:flora', this.renderFauna, this);
                this.model.on('change:communities', this.renderCommunities, this);
            }

        },

        render: function () {
            this.$el.html(this.compiled(this.model.toJSON()));
            // for incomplete region model without spatial profile url (l.e Western Australia)
            if (!this.model.getSpatialProfileURL()){
                this.$el.find("#spatial_profile_url").html("");
            }
            if (this.model.get('fauna')) {
                this.renderFauna();
            }
            if (this.model.get('flora')) {
                this.renderFlora();
            }
            if (this.model.get('communities')) {
                this.renderCommunities();
            }
        },

        renderSummary: function (data) {
            if (data === 'fauna') {
                this.renderFauna();
            } else if (data === 'flora') {
                this.renderFlora();
            } else if (data === 'communities') {
                this.renderCommunities();
            } else if (data === 'wetlands') {
                this.renderWetlands();
            } else {
                console.error("Unknown data source:", data)
            }
        },

        renderFauna: function () {
            if (this.model.get('fauna')) {
                var view = new FaunaSummaryView({model: this.model.get('fauna')})
                view.render();
            }
        },

        renderFlora: function () {
            if (this.model.get('flora')) {
                new FloraSummaryView({model: this.model.get('flora')}).render();
            }
        },

        renderCommunities: function () {
            if (this.model.get('communities')) {
                new CommunitiesSummaryView({model: this.model.get('communities')}).render();
            }
        },

        renderWetlands: function () {
            if (this.model.get('wetlands')) {
                new WetlandsSummaryView({model: this.model.get('wetlands')}).render();
            }
        }
    });

    return View;
});