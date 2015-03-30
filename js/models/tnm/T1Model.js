define([
        'underscore',
        'backbone',
        'dataSources'
    ]
    , function (_, Backbone, dataSources) {

        return Backbone.Model.extend({

            initialize: function () {

            },

            parseFauna: function (records) {

            },

            onReady: function (callBack) {
                dataSources.fauna.onReady(function () {
                    console.log("fauna ready");
                    dataSources.flora.onReady( function (){
                        console.log("flora ready");
                        dataSources.communities.onReady(function () {
                            console.log("communities ready");
                            dataSources.wetlands.onReady(function () {
                                console.log("wetlands ready");
                                callBack();
                            })
                        })
                    })
                })
            }

        });
    });