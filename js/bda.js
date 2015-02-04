var bda = bda || {};

/**
 * provides some high level helpers for the great DataTable jQuery plug-in
 * see: http://datatables.net/
 * notably add some useful methods like populate and fetch
 */
bda.datatables = (function () {
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

}());

bda.data_api = (function () {
    var ref_ids = {
        fauna_master_human_headers: 'd66bf8af-9456-4b4b-a60c-3dbaa788bcfc',
        fauna_master_machine_headers: 'ab5bd599-73cc-4dbc-94f2-6d35ee24d1c6',
        fauna_headers_mapping: 'f3368ce6-0de5-4a9d-98df-6de0d5f69196'
    };
    var search_url_base = 'http://internal-data.dpaw.wa.gov.au/api/3/action/datastore_search',
        sql_url_base = 'http://internal-data.dpaw.wa.gov.au/api/3/action/datastore_search_sql';


    return {
        search_fauna: function (params, success) {
            params = params || {};
            params['resource_id'] = ref_ids['fauna_master_human_headers'];
            success = success || function (data) {console.log(data);};
            $.ajax({
                url: search_url_base,
                dataType: "json",
                data: params,
                success: success,
                error: function (data) {
                    var msg = data.responseJSON.error.fields[0];
                    console.log("Error = ", msg);
                }
            })
        }
    };
}());

bda.tnm = (function () {

    function not_empty(s) {
        return s && s.trim().length > 0;
    }

    function show_Q59() {
        function format (records) {
            // filter empty Conservation status WA
            var filtered = _(records)
                .filter(function (r) { return not_empty(r['Conservation status WA'])})
                .value();
            var summary = summarize(filtered);
            return {
                summary: summary,
                all: filtered
            };
        }
        function summarize(records) {
            var result = _(records)
                .map(function (r) {
                    return _.pick(r, ['Scale', 'Conservation status WA']);
                })
                .groupBy('Scale')
                .map(function (values, scale) {
                    var cr_count=0, en_count=0, vu_count=0, error_count = 0;
                    _.forEach(values, function (v) {
                        var status = v['Conservation status WA'].trim().toLowerCase();
                        if (_.startsWith(status, 'cr')) { cr_count +=1; }
                        else if (_.startsWith(status, 'en')) { en_count +=1;}
                        else if (_.startsWith(status, 'vu')) { vu_count +=1;}
                        else { error_count +=1;}
                    });
                  return {
                      'Scale': scale,
                      'CR': cr_count,
                      'EN': en_count,
                      'VU': vu_count,
                      'Error': error_count,
                      'Total': cr_count + en_count + vu_count
                  };
                })
                .value();
            return result;
        }
        function display(data) {
            var table_options = {paging: true,
                info: true,
                searching: true,
                scrollCollapse: true,
                processing: true,
                deferRender: true,
                language: {"search": "Filter:"} // change the label of the search box to filter};
            };
            var columns_summary = [
                {
                    title: 'Scale',
                    width: "0%",
                    data: 'Scale'
                },
                {
                    title: 'CR',
                    width: "0%",
                    data: 'CR'
                },
                {
                    title: 'EN',
                    width: "0%",
                    data: 'EN'
                },
                {
                    title: 'VU',
                    width: "0%",
                    data: 'VU'
                },

                {
                    title: 'Error',
                    width: "0%",
                    visible: false,
                    data: 'Error'
                },

                {
                    title: 'Total',
                    width: "0%",
                    data: 'Total'
                }
            ];
            var columns_details = [
                {
                    title: 'Scale',
                    width: "0%",
                    data: 'Scale'
                },
                {
                    title: 'Scientific name',
                    width: "0%",
                    data: 'Scientific name'
                },
                {
                    title: 'Common name',
                    width: "0%",
                    data: 'Common name'
                },
                {
                    title: 'Conservation status WA',
                    width: "0%",
                    data: 'Conservation status WA'
                }

            ];
            var table_summary = bda.datatables.init_table('#table_q59_summary', table_options, columns_summary),
                table_details = bda.datatables.init_table('#table_q59_details', table_options, columns_details);
            table_summary.populate(data['summary']);
            table_details.populate(data['all']);
        }
        var params = {
            fields: "Scale, Scientific name,Common name,Conservation status WA",
            limit: 100 * 1000
        };
        bda.data_api.search_fauna(params, function(data) {
            display(format(data.result.records));

        })
    }


    return {
        show_Q59: show_Q59

    };
}());
