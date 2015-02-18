define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/regionTemplate.html',
    'models/fauna',
    'app/tableFacade',
    'views/faunaSummaryView'
], function ($, _, Backbone, template, fauna, tables,
    FaunaSummaryView) {


    var View = Backbone.View.extend({

        initialize: function (options) {
            _.bindAll(this, 'render', 'renderFauna');
            if (this.model) {
                this.model.on('change:fauna', this.renderFauna, this);
            }

        },

        compiled: _.template(template),

        render: function () {
            this.$el.html(this.compiled(this.model.toJSON()));
            if (this.model.get('fauna')){
                this.renderFauna();
            }
        },

        renderFauna: function () {
            if (this.model.get('fauna')) {
                new FaunaSummaryView({model: this.model.get('fauna')}).render();
            }
        }
    });

    return View;
});