define([
    'jquery',
    'underscore',
    'backbone',
    'views/region/faunaView',
], function ($, _, Backbone, FaunaView) {

    return FaunaView.extend({
        el: '#floraTab'
    });



});