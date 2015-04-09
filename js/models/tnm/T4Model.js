define([
        'jquery',
        'underscore',
        'backbone',
        'dataSources',
        'app/filters',
        'models/speciesModel',
        'models/communityModel',
        'models/wetlandModel',
        'models/tnm/T1Model'
    ]
    , function ($, _, Backbone, dataSources, filters, SpeciesModel, CommunityModel, WetlandModel, T1Model) {

        return T1Model.extend({

            collectMaps: [
                {
                    columnName: "MANREQ_RESEARCH_CAT",
                    collectName: 'research',
                    label: 'Research'
                },
                {
                    columnName: "MANREQ_CONSPLAN_CAT",
                    collectName: 'consplan',
                    label: 'Conservation Planning'
                }
            ],

            collect: function (records, modelBuilder) {
                var result = {};
                var addModel = _.bind(this._addModelToValue, this);
                var collectMaps = this.collectMaps;
                // build destination 'bucket'
                _.each(collectMaps, function (map) {
                    var bucket = map.collectName;
                    if (bucket && !result[bucket]) {
                        result[bucket] = {};
                    }
                });

                _.each(records, function (r) {
                    var model = modelBuilder(r);
                    if (model) {
                        _.each(collectMaps, function (map) {
                            var value = r.get(map.columnName);
                            if (filters.notEmpty(value) && !filters.isNA(value)) {
                                var bucket = map.collectName ? result[map.collectName] : result;
                                addModel(bucket, value, model);
                            }
                        });
                    }
                });
                return result;
            },

            modelFactory: function (Model) {
                return function (record) {
                    var model = new Model();
                    var attributes = _.pick(record.attributes, _.values(model.fields));
                    model.set(attributes);
                    return model;
                };
            },

            parseSpecies: function (records) {
                return this.collect(records, this.modelFactory(SpeciesModel));
            },

            parseCommunities: function (records) {
                return this.collect(records, this.modelFactory(CommunityModel));
            },

            parseWetlands: function (records) {
                return this.collect(records, this.modelFactory(WetlandModel));
            }

        });
    });