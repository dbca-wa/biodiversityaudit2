define([
    'jquery',
    'jqueryui',
    'underscore',
    'backbone',
    'models/faunaSpeciesList',
    'models/floraSpeciesList',
    'models/communityList',
    'models/wetlandList',
    'views/assets/assetsSpeciesSummaryView',
    'views/assets/assetsCommunitySummaryView',
    'text!templates/assets.html'
], function ($, ui, _, Backbone, FaunaList, FloraList, CommunityList, WetlandList, SpeciesSummaryView, CommunitySummaryView, template) {

    function getSpeciesLabel(model) {
        var result = model.id();
        if (model.name()) {
            result += ' (' + model.name() + ')';
        }
        return result;
    }

    function getCommunityLabel(model) {
        var result = model.id();
        if (model.name()) {
            result += ' (' + model.name() + ')';
        }
        return result;
    }

    function getWetlandLabel(model) {
        return model.id();
    }

    return Backbone.View.extend({
        el: '#content',
        events: {
            "click #species_header": function () {
                this.clear('species')
            },
            "click #community_header": function () {
                this.clear('community')
            },
            "click #wetland_header": function () {
                this.clear('wetland')
            }
        },

        initialize: function () {
            this.fauna = new FaunaList();
            this.flora = new FloraList();
            this.communities = new CommunityList();
            this.wetlands = new WetlandList();
        },

        render: function (type, id) {
            this.$el.html(_.template(template, {}));
            this.initSpeciesInputs();
            this.initCommunityInputs();
            this.initWetlandInputs();
            this.fauna.on("reset", this.initSpeciesInputs, this);
            this.flora.on("reset", this.initSpeciesInputs, this);
            this.communities.on("reset", this.initCommunityInputs, this);
            this.wetlands.on("reset", this.initWetlandInputs, this);
            // show something?
            if (type || id) {
                if (type === 'fauna' || type === 'flora'){
                    type = 'species';
                }
                this.doSelectValue(type, id);
            }
            else {
                this.doSelectValue('species', undefined);
            }
        },

        doSelectValue: function (type, id){
            // here type must be species, community, wetland
            var tab = this.$el.find("#" + type + "_header"),
                input = this.$el.find("#" + type + "_input"),
                menu;
            // select the tab
            tab.click();
            // simulate a auto complete selection
            if (id) {
                input.autocomplete("search", id);
            }
            menu = input.autocomplete("widget");
            $(menu[0].children[0]).click();
        },

        initSpeciesInputs: function () {
            $("#species_input").autocomplete({
                source: _.bind(function (request, response) {
                    var faunaValues = this.fauna ? this.buildTaxaValues(this.fauna, 'fauna') : [];
                    var floraValues = this.flora ? this.buildTaxaValues(this.flora, 'flora') : [];
                    var allValues = faunaValues.concat(floraValues);
                    //delegate to the normal auto complete response
                    response($.ui.autocomplete.filter(allValues, request.term));
                }, this),
                select: _.bind(function (event, ui) {
                    this.showSpeciesSummary(ui.item.category, ui.item.value);
                }, this)
            });
        },

        initCommunityInputs: function () {
            $("#community_input").autocomplete({
                source: _.bind(function (request, response) {
                    var allValues = this.communities.map(function (model) {
                        return {
                            value: model.id(),
                            label: getCommunityLabel(model)
                        }
                    });
                    response($.ui.autocomplete.filter(allValues, request.term));
                }, this),
                select: _.bind(function (event, ui) {
                    this.showCommunitySummary(ui.item.value)
                }, this)
            })
        },

        initWetlandInputs: function () {
            $("#wetland_input").autocomplete({
                source: _.bind(function (request, response) {
                    var allValues = this.wetlands.map(function (model) {
                        return {
                            value: model.id(),
                            label: getWetlandLabel(model)
                        }
                    });
                    response($.ui.autocomplete.filter(allValues, request.term));
                }, this),
                select: _.bind(function (event, ui) {
                    this.showWetlandSummary(ui.item.value, ui.item.label)
                }, this)
            })
        },

        showSpeciesSummary: function (category, taxon) {
            var collection, model, records;
            collection = category === 'fauna' ? this.fauna : this.flora;
            model = collection.find(function (model) {
                return model.id() === taxon;
            });
            if (model) {
                records = model.recordsByRegion();
                // clear previous tables
                this.clearTables();
                new SpeciesSummaryView({model: records, label: getSpeciesLabel(model)}).render();
            }
        },

        showCommunitySummary: function (id) {
            var model, records;
            model = this.communities.find(function (m) {
                return m.id() === id
            });
            if (model) {
                records = model.recordsByRegion();
                this.clearTables();
                new CommunitySummaryView({model: records, label: id}).render();
            }
        },

        showWetlandSummary: function (id) {
            var model, records;
            model = this.wetlands.find(function (m) {
                return m.id() === id
            });
            if (model) {
                records = model.recordsByRegion();
                this.clearTables();
                new CommunitySummaryView({model: records, label: id}).render();
            }
        },

        buildTaxaValues: function (collection, category) {
            return collection.map(function (model) {
                return {
                    value: model.id(),
                    label: getSpeciesLabel(model),
                    category: category
                };
            });
        },

        clearTables: function () {
            this.$el.find('#summary_content').html('');
            this.$el.find('#details_content').html('');
        },

        clearInput: function (type) {
            this.$el.find('#' + type + '_input').autocomplete().val('');
        },

        clear: function (type) {
            this.clearTables();
            this.clearInput(type);
        }

    });
});