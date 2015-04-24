define([
    'jquery',
    'underscore',
    'backbone',
    'datatables',
    'app/tableFacade'
], function ($, _, Backbone, DataTable, tables) {
    'use strict';

    return Backbone.View.extend({

//        id: 'table',

        el: '#table',

        options: {
            fields: [],
            filters: [
//            {
//                field: 'STATUSWA',
//                predicate: notEmpty
//            }
//            {
//                field: '__one__',
//                predicate: notEmpty
//            }
            ],
            debug: true
        },

        initialize: function (options) {
            _.extend(this.options, options);
        },

        _buildColumnDefinitions: function () {
            // all the fields definition can be retrieve from the fields property of the first record
            var first = this.collection ? this.collection.at(0) : this.model[0];
            var allFields = first.fields;
            var width = '' + Math.floor(100/this.options.fields.length) + 'vw';
            return _.map(this.options.fields, function (id) {
                var matches = allFields.filter(function (f) {
                    return f.get('id') === id;
                });
                var columnTitle = matches ? matches[0].get('label') : id;
                var dataDefinition = matches ? id : '';
                return {
                    title: columnTitle,
                    data: dataDefinition,
                    width: width
                }
            });
        },

        _applyFilters: function () {
            var rows = this.model || this.collection.models;
            var filters = this.options.filters;
            var viewedFields = this.options.fields;
            _.each(filters, function (filter) {
                rows = rows.filter(function (row) {
                    var viewedAttributes = !_.isEmpty(viewedFields) ? _.pick(row.attributes, viewedFields) : rows.attributes;
                    if (filter.field === '__one__') {
                        // one of the field must verify
                        return _.some(viewedAttributes, filter.predicate);
                    } else if (filter.field === '__all__') {
                        return _.all(viewedAttributes, filter.predicate);
                    }
                    else {
                        return filter.predicate(row.get(filter.field));
                    }
                });
            });
            return rows;
        },

        render: function () {
            var columnDefs = this.columnDefs || this._buildColumnDefinitions();
            var table = tables.initTable(this.$el.selector, {}, columnDefs);
            var rows = this._applyFilters();
            var json = _.map(rows, function (model) {
                return model.toJSON();
            });
            table.populate(json);
            return table;
        }
    });

});