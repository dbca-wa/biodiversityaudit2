define([
    'underscore',
    'config.local'
], function (_, local) {
    var ckan = {
        base_url: 'http://internal-data.dpaw.wa.gov.au',
        master_dataset: '63a9cb0f-3d8a-4feb-9c2a-2431f7017d10',
        resources: {
            fauna_csv: 'e9af8028-a790-4a5c-b713-84eb69298175',
            flora_csv: 'e9af8028-a790-4a5c-b713-84eb69298175',
            communities_csv: '7bdc88b6-2b78-471c-9f87-e133efeed90e',
            wetlands_csv: 'e9af8028-a790-4a5c-b713-84eb69298175'
        }
    };
    var urls = {
        fauna_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.fauna_csv),
        fauna_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.fauna_csv),
            'download',
            'fauna.csv' ]),
        flora_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.flora_csv),
        flora_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.flora_csv),
            'download',
            'flora.csv' ]),
        communities_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.communities_csv),
        communities_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.communities_csv),
            'download',
            'communities.csv' ]),
        wetlands_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.wetlands_csv),
        wetlands_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.wetlands_csv),
            'download',
            'wetlands.csv' ]),
        ibra_geojson: build_url([
            build_ckan_resource_base_url('10b54e2b-7226-4dfb-b3ef-30264cd0670a', 'd32d65a1-7ebe-4457-a208-03fd9f1a456f'),
            'download/ibra7.geojson']),
        fauna_csv_test: '../data/fauna-master.csv',
        communities_csv_test: '../data/communities-master.csv',
        ibra_geojson_test: '../data/ibra7.geojson'
    };

    var config = {
        ckan: ckan,
        urls: urls,
        datasource: 'csv' // [csv|datastore|test] ckan csv files, ckan datastore, test: local files in data folder
    };

    // if local config it overrides the default
    if (local) {
        _.extend(config, local)
    }


    function build_ckan_resource_base_url(dataset, resource_id) {
        return build_url([ckan.base_url, 'dataset', dataset, 'resource', resource_id]);
    }


    function build_url(parts) {
        return parts.join('/')
    }


    return config;
});