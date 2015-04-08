define([
    'jquery',
    'underscore',
    'backbone',
    'app/tableFacade',
    'text!templates/spike.html',
    'models/regionList',
    'views/tnm/regionInputView'
], function ($, _, Backbone, dt, template, Model, View) {

    return Backbone.View.extend({
        el: '#content',

        initialize: function () {
            this.model = new Model();
        },

        render: function () {
            var inputView ;
            this.$el.html(_.template(template, {}));
            inputView = new View({el: '#region_input', model: this.model});
            inputView.render();
            inputView.setSelectCallback(function (item) {console.log('item', item)});
        }
    });
});