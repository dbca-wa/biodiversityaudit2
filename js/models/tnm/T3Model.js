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

            initialize: function () {
                this.deferred = this.fetch();
            },

            fetch: function () {
                var deferred = new $.Deferred();
                var result = {};
                var parseSpecies = _.bind(this.parseSpecies, this);
                var parseCommunities = _.bind(this.parseCommunities, this);
                var parseWetlands = _.bind(this.parseWetlands, this);
                dataSources.fauna.onReady(function (list, records) {
                    result.fauna = parseSpecies(records);
                    dataSources.flora.onReady(function (list, records) {
                        result.flora = parseSpecies(records);
                        dataSources.communities.onReady(function (list, records) {
                            result.communities = parseCommunities(records);
                            dataSources.wetlands.onReady(function (list, records) {
                                result.wetlands = parseWetlands(records);
                                deferred.resolve(result);
                            })
                        })
                    })
                });
                return deferred;
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
                        past: {},
                        future: {}
                    },
                    addModel = _.bind(this._addModelToValue, this);
                _.each(records, function (r) {
                    var model = toSpeciesModel(r);
                    var past = r.get('PASTPRESSURES_CAT');
                    var future = r.get('FUTURETHREATS_CAT');
                    if (filters.notEmpty(past) && !filters.isNA(past)) {
                        addModel(result.past, past, model);
                    }
                    if (filters.notEmpty(future) && !filters.isNA(future)) {
                        addModel(result.future, future, model);
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
                        past: {},
                        future: {}
                    },
                    addModel = _.bind(this._addModelToValue, this);
                _.each(records, function (r) {
                    var model = toCommunityModel(r);
                    var past = r.get('PASTPRESSURES_CAT');
                    var future = r.get('FUTURETHREATS_CAT');
                    if (filters.notEmpty(past) && !filters.isNA(past)) {
                        addModel(result.past, past, model);
                    }
                    if (filters.notEmpty(future) && !filters.isNA(future)) {
                        addModel(result.future, future, model);
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
             */
            onReady: function (success, err) {
                this.deferred.promise().then(success, err)
            }

        });
    });