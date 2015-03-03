define([
    'jquery',
    'underscore',
    'backbone',
    'models/faunaSpeciesList',
    'models/floraSpeciesList',
    'text!templates/species.html'
], function ($, _, Backbone, FaunaList, FloraList, template) {
    
    function getSpeciesLabel(model) {
        return model.taxon() + ' (' + model.common() + ')';    
    }

    function setBoxValues (id, values) {
        var node = $(id);
        $(id).autocomplete({
            source: values
        });
        return node;
    }

    return Backbone.View.extend({
        el: '#content',

        initialize: function () {
            this.fauna = new FaunaList();
            this.flora = new FloraList();
            this.fauna.on("reset", this.setFaunaList, this);
            this.flora.on("reset", this.setFloraList, this);
        },

        render: function () {
            this.$el.html(_.template(template, {}));

        },

        setFaunaList: function () {
            if (this.fauna) {
                setBoxValues(
                    '#fauna_species',
                    this.fauna.map( function (model) {
                        return {
                            value: model.taxon(),
                            label: getSpeciesLabel(model)
                        };
                    })
                ).on("autocompleteselect", function(event, ui) {
                        this.showSummary(ui.value);
                    } );
            }
        },

        setFloraList: function () {
            if (this.flora) {
                setBoxValues(
                    '#flora_species',
                    this.flora.map( function (model) {
                        return getSpeciesLabel(model);
                    })
                );
            }
        },

        showSummary: function (taxon) {
            console.log('Show summary for ', taxon)

        }

    });
});