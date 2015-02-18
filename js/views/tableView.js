define([
    'jquery',
    'underscore',
    'backbone',
    'datatables',
    'app/tableFacade'
], function ($, _, Backbone, DataTable, tables) {
    'use strict';

    var TableView = Backbone.View.extend({

        id: 'table',

        options: {
            fields: [],
            filters: [
//            {
//                field: 'TT_STATUSWA',
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
            var _fields = first.fields;
            var wanted = this.options.fields;
            if (!_.isEmpty(wanted)) {
                _fields = _fields.filter(function (f) {
                    return _.contains(wanted, f.get('id').trim());
                });
            }
            return _fields.map(
                function (f) {
                    return {
                        title: f.get('label'),
                        data: f.get('id')
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
                    if (filter.field === '__one__'){
                        // one of the field must verify
                        return _.some(viewedAttributes, filter.predicate);
                    } else if (filter.field === '__all__') {
                        return _.all(viewedAttributes, filter.predicate);
                    }
                    else{
                        return filter.predicate(row.get(filter.field));
                    }
                });
            });
            return rows;
        },

        render: function () {
            var columnDefs = this.columnDefs || this._buildColumnDefinitions();
            var table = tables.initTable('#' + this.id, {}, columnDefs);
            var rows = this._applyFilters();
            var json = _.map(rows, function (model) {
                return model.toJSON();
            });
            table.populate(json);
            return table;
        }

    });

    return TableView;

});