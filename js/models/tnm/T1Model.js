define([
        'jquery',
        'underscore',
        'backbone',
        'dataSources',
        'app/filters',
        'models/speciesModel',
        'models/communityModel'
    ]
    , function ($, _, Backbone, dataSources, filters, SpeciesModel, CommunityModel) {

        return Backbone.Model.extend({

            initialize: function (regionCode) {
                this.region = regionCode;
                this.deferred = this.fetch();
            },

            fetch: function () {
                var deferred = new $.Deferred();
                var result = {};
                var parseSpecies = _.bind(this.parseSpecies, this);
                var parseCommunities = _.bind(this.parseCommunities, this);
                var filterRegion = _.bind(this.filterRegion, this);
                dataSources.fauna.onReady(function (list, records) {
                    result.fauna = parseSpecies(filterRegion(records));
                    dataSources.flora.onReady(function (list, records) {
                        result.flora = parseSpecies(filterRegion(records));
                        dataSources.communities.onReady(function (list, records) {
                            result.communities = parseCommunities(filterRegion(records));
                            dataSources.wetlands.onReady(function (list, records) {
                                result.wetlands = parseCommunities(filterRegion(records));
                                deferred.resolve(result);
                            })
                        })
                    })
                });
                return deferred;
            },

            filterRegion: function (records) {
                return this.region ? _.filter(records, filters.regionFilter(this.region)) : records;
            },

            _addModelToValue: function (result, value, model) {
                var previous;
                if (!result[value]) {
                    result[value] = {
                        count: 0,
                        models: []
                    };
                }
                previous = result[value];
                // we add a model (species or communities) only if it doesn't already exist.
                if (!_.find(previous.models, function (m) {
                    return model.id() === m.id();
                })) {
                    previous.count += 1;
                    previous.models.push(model)
                }
                return result
            },

            /*
             Valid for fauna and flora
             Format returned
             {
             pop: {trend: {count: <number> models: [speciesModel]
             mature: {trend: {count: <number> models: [speciesModel]
             }
             */
            parseSpecies: function (records) {
                function toSpeciesModel(record) {
                    var model = new SpeciesModel();
                    var attributes = _.pick(record.attributes, _.values(model.fields));
                    model.set(attributes);
                    return model;
                }

                var result = {
                        population: {},
                        mature: {}
                    },
                    addModel = _.bind(this._addModelToValue, this);
                _.each(records, function (r) {
                    var model = toSpeciesModel(r);
                    var popTrend = r.get('KNOWNPOPS_TREND');
                    var matureTrend = r.get('MATIND_TREND');
                    if (filters.notEmpty(popTrend) && !filters.isNA(popTrend)) {
                        addModel(result.population, popTrend, model);
                    }
                    if (filters.notEmpty(matureTrend) && !filters.isNA(matureTrend)) {
                        addModel(result.mature, matureTrend, model);
                    }
                });
                return result;
            },

            /*
             Format returned
             {
             occurrence: {trend: {count: <number> models: [communityModel]
             aoo: {trend: {count: <number> models: [communityModel]
             }
             */
            parseCommunities: function (records) {
                function toCommunityModel(record) {
                    var model = new CommunityModel();
                    var attributes = _.pick(record.attributes, _.values(model.fields));
                    model.set(attributes);
                    return model;
                }

                var result = {
                        occurrence: {},
                        aoo: {}
                    },
                    addModel = _.bind(this._addModelToValue, this);
                _.each(records, function (r) {
                    var community = toCommunityModel(r);
                    var occTrend = r.get('KNOWNOCC_TREND');
                    var aooTrend = r.get('AOOAREA_TREND');
                    if (filters.notEmpty(occTrend) && !filters.isNA(occTrend)) {
                        addModel(result.occurrence, occTrend, community);
                    }
                    if (filters.notEmpty(aooTrend) && !filters.isNA(aooTrend)) {
                        addModel(result.aoo, aooTrend, community);
                    }
                });
                return result;
            },

            parseWetlands: function (records) {
                var result = {
                    past: {},
                    future: {}
                };
                return result;
            },


            /*
             Convenient method.
             Will call success(data) when the all the data (fauna/flora/communities has been parsed)
             Data format, for fauna same for flora. For communities it is occurrence and aoo instead of mature and population:
             {
             fauna: {
             mature: {
             trend_value: {
             count:<number>
             species: [speciesModel]
             }
             population: {
             trend_value: {
             count:<number>
             species: [speciesModel]
             }
             }
             }
             */
            onReady: function (success, err) {
                this.deferred.promise().then(success, err)
            }

        });
    });