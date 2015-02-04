window.HeaderView = Backbone.View.extend({

    template: _.template("../template/header.html"),
    initialize: function () {
        console.log("Header view: initialize");
    },

    render: function () {
        console.log("Header view: render");
        $(this.el).html(this.template());
//        $('.navbar-search', this.el).append(this.searchresultsView.render().el);
        return this;
    }

});