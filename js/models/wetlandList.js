define([
        'underscore',
        'backbone',
        'dataSources',
        'models/wetlandModel'
    ]
    , function (_, Backbone, dataSources, model) {

        return Backbone.Collection.extend({
            model: model,
            source: dataSources.wetlands,

            initialize: function () {
                this.source.onReady(_.bind(this.createAll, this));
            },

            createAll: function (recordCollection, recordArray) {
                var species = _(recordArray)
                    .groupBy(function (r) {
                        return r.get('WETLANDNAME');
                    })
                    .map(function (records) {
                        var firstRecord = records[0];
                        return {
                            WETLANDNAME: firstRecord.get('WETLANDNAME'),
                            WETLANDOTHERNAME: firstRecord.get('WETLANDOTHERNAME'),
                            DPAWREGION: firstRecord.get('DPAWREGION'),
                            records: records
                        }
                    })
                    .value();
                this.reset(species);
            }
        });
    });