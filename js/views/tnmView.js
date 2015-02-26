define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/tnm.html',
    'app/tableFacade'
], function ($, _, Backbone, template, tables) {
    function not_empty(s) {
        return s && s.trim().length > 0;
    }

    function show_Q59() {
        function format(records) {
            // filter empty Conservation status WA
            var filtered = _(records)
                .filter(function (r) {
                    return not_empty(r['Conservation status WA'])
                })
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
                    var cr_count = 0, en_count = 0, vu_count = 0, error_count = 0;
                    _.forEach(values, function (v) {
                        var status = v['Conservation status WA'].trim().toLowerCase();
                        if (_.startsWith(status, 'cr')) {
                            cr_count += 1;
                        }
                        else if (_.startsWith(status, 'en')) {
                            en_count += 1;
                        }
                        else if (_.startsWith(status, 'vu')) {
                            vu_count += 1;
                        }
                        else {
                            error_count += 1;
                        }
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
            var tableOptions = {  }; //use default
            var colsSummary = [
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
            var colsDetails = [
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
            var tableSummary = tables.initTable('#table_q59_summary', tableOptions, colsSummary),
                tableDetails = tables.initTable('#table_q59_details', tableOptions, colsDetails);
            tableSummary.populate(data['summary']);
            tableDetails.populate(data['all']);
        }

        var params = {
            fields: "Scale, Scientific name,Common name,Conservation status WA",
            limit: 100 * 1000
        };
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