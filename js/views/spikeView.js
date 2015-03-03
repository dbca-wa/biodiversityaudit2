define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/spike.html',
    'models/faunaSpeciesList',
    'jqueryui',
], function ($, _, Backbone, template, FaunaList) {


    return Backbone.View.extend({
        el: '#content',

        _compiled: _.template(template),

        initialize: function () {
            this.model = new FaunaList();
            if (this.model) {
                this.model.on("reset", this.setBoxValues, this);
            }
            this.render();
        },

        render: function () {
            this.$el.html(this._compiled({}));
            window.speciesList = this.model;
        },

        setBoxValues: function () {
            var labels = this.model.map( function (s) {
                return s.taxon();
            });
            console.log("Set labels", labels)
            $('#species').autocomplete({
                source: labels
            });
        }
    });
});