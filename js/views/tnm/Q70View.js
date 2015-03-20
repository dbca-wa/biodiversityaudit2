define([
    'jquery',
    'underscore',
    'backbone',
    'app/tableFacade',
    'app/filters',
    'dataSources'
], function ($, _, Backbone, tables, filters, dataSources) {

    function extractTaxonGroup(tt_schedule) {
        if (tt_schedule && tt_schedule.indexOf(':') !== -1) {
            return tt_schedule.split(':')[1];
        }
        else {
            return tt_schedule;
        }
    }

    // @todo: this can be much more improved with sortBy collections.
    function getPastPressures(records, region, group) {
        return _(records)
            .filter(function (rec) {
                return rec.get('SCALE') === region
                    && rec.get('SCHEDULE') === group
                    && filters.notEmpty(rec.get('KNOWNPOPS_TREND'));
            })
            .map(function (r) {
                return r.get('KNOWNPOPS_TREND');
            })
            .groupBy(function (r) {
                return r;
            })
            .map(function (values, pressure) {
                return {
                    pressure: pressure,
                    count: values.length
                }
            })
            .sortBy(function (o) {
                return -o.count;
            })
            .value();
    }


    return Backbone.View.extend({
        el: '#Q70',

        _cellTemplate: _.template(
            '<ul><% _.forEach(values, function(value) { %><li"><%- value.pressure %> : <%- value.count %></li><% }); %></ul>'),

        initialize: function () {

        },

        render: function () {
            dataSources.fauna.onReady(_.bind(this.renderFauna, this));
            dataSources.flora.onReady(_.bind(this.renderFlora, this));
        },

        renderFauna: function (collection, records) {
            records = _(records)
                .filter(function (r) {
                    return filters.notEmpty(r.get('PASTPRESSURES_CAT'));
                })
                .value();
            // find group (col SCHEDULE)
            var byGroup = _(records)
                .groupBy(function (r) {
                    return r.get('SCHEDULE');
                })
                .value();
            var groups = _.keys(byGroup);
            var byRegion = _(records)
                .groupBy(function (r) {
                    return r.get('SCALE');
                })
                .value();
            var regions = _.keys(byRegion);
            var rows = [];

            rows = _(regions)
                .map(function (region) {
                    var row = {};
                    row.region = region;
                    _.each(groups, function (group) {
                        row[group] = getPastPressures(records, region, group);
                    });


                    return row;
                })
                .value();

//            console.log('rows', rows);

            var columnDefs = this.buildColumnDefinitions(groups);
//            console.log('columns', columnDefs);
            var tableOptions = {
            };
            var table = tables.initTable('#table_q70_fauna', tableOptions, columnDefs);

//            console.log("fauna rows", rows);
            table.populate(rows);
        },

        renderFlora: function (collection, records) {
            records = _(records)
                .filter(function (r) {
                    return filters.notEmpty(r.get('PASTPRESSURES_CAT'));
                })
                .value();
            // find group (col SCHEDULE)
            var byGroup = _(records)
                .groupBy(function (r) {
                    return r.get('SCHEDULE');
                })
                .value();
            var groups = _.keys(byGroup);
//            console.log('groups', byGroup);
            var byRegion = _(records)
                .groupBy(function (r) {
                    return r.get('SCALE');
                })
                .value();
            var regions = _.keys(byRegion);
//            console.log('regions', byRegion);
            var rows = [];

            rows = _(regions)
                .map(function (region) {
                    var row = {};
                    row.region = region;
                    _.each(groups, function (group) {
                        var pastPressures = getPastPressures(records, region, group);
//                        console.log('pastPressure for', region, group, '=', pastPressures);
                        row[group] = pastPressures;
                    });


                    return row;
                })
                .value();

//            console.log('rows', rows);

            var columnDefs = this.buildColumnDefinitions(groups);
//            console.log('columns', columnDefs);
            var table = tables.initTable('#table_q70_flora', {}, columnDefs);

//            console.log("fauna rows", rows);
            table.populate(rows);
        },

        buildColumnDefinitions: function (groups) {
            var result = [
                {
                    title: 'Region',
                    data: 'region',
                    width: '5%'

                }
            ];
            var coloumnWith = 95/groups.length;
            var renderFunction = _.bind(this.renderAsList, this);
            _.each(groups, function (g) {
                result.push({
                    title: extractTaxonGroup(g),
                    data: g,
                    width: '' + coloumnWith + '%',
                    render: function (data) {
                        return renderFunction(data);
                    }
                });
            });
            return result;
        },

        renderAsList: function (values) {
            values = _.sortBy(values, function (v) {return -v.count});
            if (values.length === 0){
                return 'N/A';
            }
            // only the first 3
            values = _.slice(values,0,4);
            var compiled = _.template('<% _.forEach(values, function(value) { %><span class="badge"><%- value.count %></span>&nbsp;<span class="q70"><%- value.pressure %></br></span><% }); %>');
            return compiled({ values: values });
        }


    });


});
