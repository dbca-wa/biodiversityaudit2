window.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "regions": "regions",
        "species": "species",
        "tnm": "tnm",
        "data": "data"
    },

    initialize: function () {
        console.log("Init Router");
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.render().el);
    }

});

templateLoader.load(["header", "home", "regions", "species", "data", "tnm"],
    function () {
        app = new Router();
        Backbone.history.start();
    });
