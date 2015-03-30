define([
    'backbone',
    'views/headerView',
    'views/footerView',
    'views/homeView',
    'views/regionsView',
    'views/assetsView',
    'views/tnmView',
    'views/dataView',
    'views/region/regionView',
    'views/aboutView',
    'views/spikeView'

], function (Backbone, HeaderView, FooterView, HomeView, RegionsView, AssetsView, TnmView, DataView, RegionView, AboutView, SpikeView) {

    var Router = Backbone.Router.extend({
        routes: {
            // App URL routes
            "": "home",
            "regions(/:type/:id)": "regions",
            "assets(/:type/:id)": "assets",
            "tnm": "tnm",
            "data": "data",
            "about": "about",
            "spike": "spike"

            // Default
            // important: don't put default rules. It will interfere with the links in the tables (details)
//            "*actions": "defaultRoute"
        }
    });

    function initialize() {
        var router = new Router();
        new HeaderView();
        new FooterView();

        router.on('route:home', function () {
            new HomeView().render();
        });

        router.on('route:regions', function (type, id) {
            new RegionsView().render(type, id);
        });

        router.on('route:assets', function (type, id) {
            new AssetsView().render(type, id);
        });

        router.on('route:tnm', function () {
            new TnmView().render();
        });

        router.on('route:data', function () {
            new DataView().render();
        });

        router.on('route:about', function () {
            new AboutView().render();
        });

        router.on('route:spike', function () {
            new SpikeView().render();
        });

        Backbone.history.start();
    }


    return {
        initialize: initialize
    };
});