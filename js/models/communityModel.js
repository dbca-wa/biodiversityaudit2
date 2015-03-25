define ([
        'underscore',
        'backbone',
        'models/speciesModel'
    ]
    , function (_, Backbone, SpeciesModel) {

        return SpeciesModel.extend({

            fields: {
                id: 'COMMUNITYID',
                name: 'COMMUNITYNAME',
                DPaWRegion: 'DPAWREGION'
            }
        });
    });