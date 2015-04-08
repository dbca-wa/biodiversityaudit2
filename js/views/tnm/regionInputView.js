define([
    'jquery',
    'jqueryui',
    'underscore',
    'backbone',
    'models/regionList',
], function ($, ui, _, Backbone, RegionListModel) {

    return Backbone.View.extend({

        initialize: function () {
            this.model = this.model || new RegionListModel();
        },

        render: function (callback) {
            var setItems = _.bind(this.setItems, this);
            this.setSelectCallback(callback);
            if (this.model) {
                this.model.onReady(function (collection) {
                    var items = collection.map(function (region) {
                        return {
                            value: region.id(),
                            label: region.id() + ' (' + region.name() + ')'
                        };
                    });
                    setItems(items, callback);
                });
            }
        },

        setSelectCallback: function (callback) {
            this.callback = callback;
        },

        setItems: function (items) {
            var that = this;
            this.$el.autocomplete({
                source: items,
                select: function (event, ui) {
                    if (that.callback) {
                        that.callback(ui.item.value);
                    }
                }
            });
        }
    });

});