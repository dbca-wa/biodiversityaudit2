define([
        'underscore',
        'backbone',
        'dataSources',
        'models/speciesModel'
    ]
    , function (_, Backbone, dataSources, speciesModel) {

        return Backbone.Collection.extend({
            model: speciesModel,
            source: dataSources.fauna,

            initialize: function () {
                this.source.onReady(_.bind(this.createAll, this));
            },

            createAll: function (recordCollection, recordArray) {
                var species = _(recordArray)
                    .groupBy(function (r) {
                        return r.get('NAMESCIEN');
                    })
                    .map(function (records) {
                        var firstRecord = records[0];
                        return {
                            NAMESCIEN: firstRecord.get('NAMESCIEN'),
                            NAMECOMMON: firstRecord.get('NAMECOMMON'),
                            DIST: firstRecord.get('DIST'),
                            records: records
                        }
                    })
                    .value();
                this.reset(species);
            }
        });
    });