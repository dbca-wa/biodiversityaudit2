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
                var modelFields = new this.model().fields;
                var groupByField = modelFields.id;
                var species = _(recordArray)
                    .groupBy(function (r) {
                        return r.get(groupByField);
                    })
                    .map(function (records) {
                        var firstRecord = records[0];
                        var attributes = _.pick(firstRecord.attributes, _.values(modelFields));
                        attributes.records = records;
                        return attributes;
                    })
                    .value();
                this.reset(species);
            }
        });
    });