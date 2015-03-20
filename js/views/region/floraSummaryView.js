define([
    'jquery',
    'underscore',
    'backbone',
    'views/region/faunaSummaryView',
], function ($, _, Backbone, FaunaSummaryView) {

    return FaunaSummaryView.extend({
        el: '#floraTab'
    });



});