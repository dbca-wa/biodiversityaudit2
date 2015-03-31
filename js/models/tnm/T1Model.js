define([
        'underscore',
        'backbone',
        'dataSources',
        'app/filters',
        'models/speciesModel',
        'models/communityModel'
    ]
    , function (_, Backbone, dataSources, filters, SpeciesModel, CommunityModel) {

        return Backbone.Model.extend({

            initialize: function () {
                this.deferred = this.fetch();
            },

            fetch: function () {
                var deferred = new $.Deferred();
                var result = {};
                var parseSpecies = _.bind(this.parseSpecies, this);
                var parseCommunities = _.bind(this.parseCommunities, this);
                dataSources.fauna.onReady(function (list, records) {
                    result.fauna = parseSpecies(records);
                    dataSources.flora.onReady(function (list, records) {
                        result.flora = parseSpecies(records);
                        dataSources.communities.onReady(function (list, records) {
                            result.communities = parseCommunities(records);
                            deferred.resolve(result);
                        })
                    })
                });
                return deferred;
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

                function append(result, trend, models) {
                    if (trend in result) {
                        result[trend].count = result[trend].count + 1;
                        result[trend]['models'].push(models);
                    } else {
                        result[trend] = {
                            count: 1,
                            models: [models]
                        }
                    }
                }

                var result = {
                    population: {},
                    mature: {}
                };
                _.each(records, function (r) {
                    var models = toSpeciesModel(r);
                    var popTrend = r.get('KNOWNPOPS_TREND');
                    var matureTrend = r.get('MATIND_TREND');
                    if (filters.notEmpty(popTrend) && !filters.isNA(popTrend)) {
                        append(result.population, popTrend, models);
                    }
                    if (filters.notEmpty(matureTrend) && !filters.isNA(matureTrend)) {
                        append(result.mature, matureTrend, models);
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

                function append(result, trend,  community) {
                    if (trend in result) {
                        result[trend].count = result[trend].count + 1;
                        result[trend]['models'].push(community);
                    } else {
                        result[trend] = {
                            count: 1,
                            models: [community]
                        }
                    }
                }

                var result = {
                    occurrence: {},
                    aoo: {}
                };
                _.each(records, function (r) {
                    var community = toCommunityModel(r);
                    var occTrend = r.get('KNOWNOCC_TREND');
                    var aooTrend = r.get('AOOAREA_TREND');
                    if (filters.notEmpty(occTrend) && !filters.isNA(occTrend)) {
                        append(result.occurrence, occTrend, community);
                    }
                    if (filters.notEmpty(aooTrend) && !filters.isNA(aooTrend)) {
                        append(result.aoo, aooTrend, community);
                    }
                });
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