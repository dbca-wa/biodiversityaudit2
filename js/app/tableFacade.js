define([
    'dataTable'
],
function (DataTable) {
    'use strict';

    function decorate_table(table) {
        table.get_data_fields = function () {
            return this.settings()[0][("aoColumns")].map(function (x) {
                return x.data;
            });
        };
        // Check that all column values are there.
        // Missing values are added as ''
        table.validate_row = function (row) {
            var fields = table.get_data_fields(),
                missing_columns = fields.filter(function (x) {
                    return row[x] === undefined;
                }),
                column_filler = {},
                column,
                i;

            for (i = 0; i < missing_columns.length; i += 1) {
                column = missing_columns[i];
                column_filler[column] = '';
            }
            return $.extend(row, column_filler);
        };

        table.populate = function (json) {
            var data = [];
            if (json) {
                if (typeof json === 'string') {
                    data = $.parseJSON(json);
                } else {
                    data = json;
                }
                var rows = data.map(table.validate_row);
                table.rows.add(rows).draw();
            }
        };

        table.fetch = function (url) {
            $.ajax({
                url: url,
                dataType: 'json',
                success: function (data) {
                    table.populate(data);
                }
            });
        };

        return table;
    }

    return {
        get_table_api: function (selector) {
            return $(selector).DataTable();
        },

        get_table_object: function (selector) {
            return $(selector).dataTable();
        },

        init_table: function (selector, global_options, column_options) {
            var options = {},
                table;
            $.fn.DataTable.ext.errMode = "throws";  // will throw a console error instead of an alert
            $.extend(options, global_options, {columns: column_options});
            table = $(selector).DataTable(options);
            // add some methods
            table = decorate_table(table);
            return table;
        }
    };
});