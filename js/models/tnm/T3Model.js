define([
        'jquery',
        'underscore',
        'backbone',
        'dataSources',
        'app/filters',
        'models/speciesModel',
        'models/communityModel',
        'models/tnm/T1Model'
    ]
    , function ($, _, Backbone, dataSources, filters, SpeciesModel, CommunityModel, T1Model) {

        return T1Model.extend({


            /*
             Valid for fauna and flora
             Format returned
             {
             past: {trend: {count: <number> models: [speciesModel]
             future: {trend: {count: <number> models: [speciesModel]
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
             past: {trend: {count: <number> models: [communityModel]
             future: {trend: {count: <number> models: [communityModel]
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
            }

        });
    });