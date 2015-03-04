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
                        return r.get('TT_NAMESCIEN');
                    })
                    .map(function (records) {
                        var firstRecord = records[0];
                        return {
                            TT_NAMESCIEN: firstRecord.get('TT_NAMESCIEN'),
                            TT_NAMECOMMON: firstRecord.get('TT_NAMECOMMON'),
                            TT_DIST: firstRecord.get('TT_DIST'),
                            records: records
                        }
                    })
                    .value();
                this.reset(species);
            }
        });
    });