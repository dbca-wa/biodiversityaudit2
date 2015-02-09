define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tnm.html',
    'app/dataFacade',
    'app/tableFacade'
], function ($, _, Backbone, template, dataFacade, tables) {
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
            var table_summary = tables.init_table('#table_q59_summary', table_options, columns_summary),
                table_details = tables.init_table('#table_q59_details', table_options, columns_details);
            table_summary.populate(data['summary']);
            table_details.populate(data['all']);
        }
        var params = {
            fields: "Scale, Scientific name,Common name,Conservation status WA",
            limit: 100 * 1000
        };
        dataFacade.search_fauna(params, function(data) {
            display(format(data.result.records));

        })
    }

    return Backbone.View.extend({
        el: '#content',

        render: function () {
            this.$el.html(_.template(template, {}));
            $(function () {
                show_Q59();
            });
        }
    });
});