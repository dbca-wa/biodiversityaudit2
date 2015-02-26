define([
    'recline',
    'config',
    'models/dataSourceModel'
], function (recline, config, DataSourceModel) {

    var faunaDataset, faunaModel,
        floraDataset, floraModel,
        communitiesDataset, communitiesModel,
        wetlandsDataset, wetlandsModel;

    if (config.datasource === 'test'){
        // use local files
        faunaDataset = new recline.Model.Dataset({
            url: config.urls.fauna_csv_test,
            backend: 'csv'
        });

        floraDataset = new recline.Model.Dataset({
            url: config.urls.flora_csv_test,
            backend: 'csv'
        });

        communitiesDataset = new recline.Model.Dataset({
            url: config.urls.communities_csv_test,
            backend: 'csv'
        });

        wetlandsDataset = new recline.Model.Dataset({
            url: config.urls.wetlands_csv_test,
            backend: 'csv'
        });

    }
    else if (config.datasource === 'datastore'){
        // use ckan datastore
        faunaDataset = new recline.Model.Dataset({
            url: config.urls.fauna_datastore,
            backend: 'ckan'
        });

        floraDataset = new recline.Model.Dataset({
            url: config.urls.flora_datastore,
            backend: 'ckan'
        });

        communitiesDataset = new recline.Model.Dataset({
            url: config.urls.communities_datastore,
            backend: 'ckan'
        });

        wetlandsDataset = new recline.Model.Dataset({
            url: config.urls.wetlands_datastore,
            backend: 'ckan'
        });

    }
    else {
        //default: ckan csv file
        faunaDataset = new recline.Model.Dataset({
            url: config.urls.fauna_csv,
            backend: 'csv'
        });

        floraDataset = new recline.Model.Dataset({
            url: config.urls.flora_csv,
            backend: 'csv'
        });

        communitiesDataset = new recline.Model.Dataset({
            url: config.urls.communities_csv,
            backend: 'csv'
        });

        wetlandsDataset = new recline.Model.Dataset({
            url: config.urls.wetlands_csv,
            backend: 'csv'
        });
    }

    faunaModel = new DataSourceModel({dataset: faunaDataset});
    floraModel = new DataSourceModel({dataset: floraDataset});
    communitiesModel = new DataSourceModel({dataset: communitiesDataset});
    wetlandsModel = new DataSourceModel({dataset: wetlandsDataset});

    return {
        fauna: faunaModel,
        flora: floraModel,
        communities: communitiesModel,
        wetlands: wetlandsModel,

        fetchAll: function () {
            faunaModel.fetch();
            floraModel.fetch();
            communitiesModel.fetch();
//            wetlandsModel.fetch();
        }
    }
});