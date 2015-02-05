define([
    'backbone',
    'views/headerView',
    'views/footerView'

], function (Backbone, HeaderView, FooterView) {

    var Router = Backbone.Router.extend({
        routes: {
            // App URL routes
            "": "home",
            "regions": "regions",
            "species": "species",
            "tnm": "tnm",
            "data": "data"

        }
    });

    function initialize() {
        var router = new Router();


        new HeaderView();
        new FooterView();


        router.on('route:home', function () {
            console.log('route: home');
        });

        router.on('route:regions', function () {
            console.log('route: regions');
        });

        router.on('route:species', function () {
            console.log('route: species');
        });

        router.on('route:tnm', function () {
            console.log('route: tnm');
        });

        router.on('route:data', function () {
            console.log('route: data');
        });

        Backbone.history.start();
    }


    return {
        initialize: initialize
    };
});