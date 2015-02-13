define([
    'jquery',
    'underscore',
    'backbone',
    'app/dataFacade'
], function ($, _, Backbone, dataFacade) {

    var model =  Backbone.Model.extend({

        defaults: {
            dataset: 'fauna',
            fields: [],
            filters: []
        }


    });

    return model;
});