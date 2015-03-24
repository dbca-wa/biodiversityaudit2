define([
        'underscore',
        'backbone',
        'dataSources',
        'models/communityModel'
    ]
    , function (_, Backbone, dataSources, communityModel) {

        return Backbone.Collection.extend({
            model: communityModel,
            source: dataSources.communities,

            initialize: function () {
                this.source.onReady(_.bind(this.createAll, this));
            },

            createAll: function (recordCollection, recordArray) {
                var species = _(recordArray)
                    .groupBy(function (r) {
                        return r.get('COMMUNITYID');
                    })
                    .map(function (records) {
                        var firstRecord = records[0];
                        return {
                            COMMUNITYID: firstRecord.get('COMMUNITYID'),
                            COMMUNITYNAME: firstRecord.get('COMMUNITYNAME'),
                            COMMUNITYDESC: firstRecord.get('COMMUNITYDESC'),
                            DPAWREGION: firstRecord.get('DPAWREGION'),
                            records: records
                        }
                    })
                    .value();
                this.reset(species);
            }
        });
    });