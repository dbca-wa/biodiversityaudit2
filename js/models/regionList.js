define([
        'jquery',
        'underscore',
        'backbone',
        'config',
        'models/regionModel',
    ],
    function ($, _, Backbone, config, RegionModel) {

        return Backbone.Collection.extend({
            model: RegionModel,

            initialize: function () {
                this.deferred = this.fetch();
            },

            fetch: function () {
                var deferred = new $.Deferred();
                var url = config.datasource === 'test' ? config.urls.ibra_min_test : config.urls.ibra_min;
                var set = _.bind(this.set, this);
                var that = this;
                $.ajax({
                    url: url,
                    xhrFields: {withCredentials: true},
                    dataType: 'json',
                    success: function (data) {
                        // add the Western Australia 'region'
                        data.push({
                            'SUB_CODE': 'Western Australia',
                            'REG_NAME': 'Western Australia'
                        });
                        set(data);
                        deferred.resolve(that);
                    }
                });
                return deferred;
            },

            onReady: function (success, err) {
                this.deferred.promise().then(success, err)
            }

        });
    });
