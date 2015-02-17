define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/regionTemplate.html',
    'models/fauna',
    'app/tableFacade'
], function ($, _, Backbone, template, fauna, tables) {

    var model = Backbone.Model.extend ({



    });

    return Backbone.View.extend({

        compiled: _.template(template),

        initFaunaSummary: function () {

        },

        faunaSummaryColDefs: function () {
            return [
                {
                    title: 'Species',
                    data: 'species'
                },
                {
                    title: 'Threats',
                    data: 'threats',
                    render: function (data, type, row, meta) {
                        var url = "#!";
                        var text = 'details';
                        return '<a href="' + url + '">' + text + '</a>'
                    }
                },
                {
                    title: 'Trends',
                    data: 'trends'
                },
                {
                    title: 'Status',
                    data: 'status'
                },
                {
                    title: 'Management Required',
                    data: 'management'
                }
            ];
        },

        render: function () {
            var colDefs,
                myCode = this.model.get('SUB_CODE');
            this.$el.html(this.compiled(this.model.toJSON()));
            // fauna summary
            colDefs = this.faunaSummaryColDefs();
            fauna.onReady(function (allRecords) {
                function buildTableRow(species, records) {
                    var threats,trends,status,management;

                    //threats. count threats
                    _.each(records, function(r) {

                    });


                    return {
                        species: species,
                        threats: threats,
                        trends: trends,
                        status: status,
                        management: management
                    }
                }
                var table = tables.initTable('#fauna_summary', {}, colDefs);
                var myRecordsBySpecies = _(allRecords)
                    .filter(function (r) { return r.get('SCALE') === myCode; })
                    .groupBy( function (r) { return r.get('TT_NAMESCIEN'); })
                    .value();
                console.log(myRecordsBySpecies);



                table.populate([]);
            })

        }
    });
});