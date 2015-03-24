define ([
        'underscore',
        'backbone']
    , function (_, Backbone) {

        return Backbone.Model.extend({

            id: function () {
                return this.get('COMMUNITYID');
            },

            name: function () {
                return this.get('COMMUNITYNAME');
            },

            desc: function () {
                return this.get('COMMUNITYDESC');
            },

            dpawRegion: function () {
                return this.get('DPAWREGION');
            },

            records: function () {
                return this.get('records');
            },

            recordsByRegion: function () {
                return _(this.records())
                    .groupBy(function (r) {
                        return r.get('SCALE');
                    })
                    .value();
            }
        });
    });