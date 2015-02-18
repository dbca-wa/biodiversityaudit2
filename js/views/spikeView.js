define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/spike.html',
    'models/fauna',
    'views/tableView',
    'app/filters',
    'views/faunaSummaryView'
], function ($, _, Backbone, template, fauna, TableView, filters, FaunaSummaryView) {


    return Backbone.View.extend({
        el: '#content',

        _compiled: _.template(template),

        initialize: function () {
            _.bindAll(this, 'render', 'renderFaunaSummary');
            if (this.model) {
//                this.model.on('change', this.render, this);
                this.model.on('change:fauna', this.renderFaunaSummary, this);
            }


        },

        render: function () {
            if (this.model) {
                console.log('render region: ', this.model.get('SUB_CODE'));
                this.$el.html(this._compiled(this.model.toJSON()));
                if (this.model.get('fauna')){
                   this.renderFaunaSummary();
                }
            }
            window.fauna = fauna;
            window.spike = this
        },

        renderFaunaSummary: function () {
            var model = this.model.get('fauna');
            var view = new FaunaSummaryView({model: model});
            if (model) {
                view.render();
            }else{
                console.log('Summary no model')
            }
        }

    });
});