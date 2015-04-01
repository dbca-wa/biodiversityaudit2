define([
        'underscore',
        'backbone',
        'dataSources',
        'models/communityModel',
        'models/faunaSpeciesList'
    ]
    , function (_, Backbone, dataSources, communityModel, FaunaSpeciesList) {

        return FaunaSpeciesList.extend({
            model: communityModel,
            source: dataSources.communities
        });
    });