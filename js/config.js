define([
    'underscore',
    'jquery'
], function (_, $) {
    var ckan = {
        base_url: 'http://internal-data.dpaw.wa.gov.au',
        master_dataset: '63a9cb0f-3d8a-4feb-9c2a-2431f7017d10',
        resources: {
            fauna_csv: 'e9af8028-a790-4a5c-b713-84eb69298175',
            fauna_xlsm: 'ff8f7b33-2beb-4577-96d2-53bc9fb92fd0',
            flora_csv: '9d9cda48-c08c-4de1-9339-789b8dc3c431',
            flora_xlsm: 'd91ae791-83ee-4c83-994f-a329e8f6e6b8',
            communities_csv: '7bdc88b6-2b78-471c-9f87-e133efeed90e',
            communities_xlsm: 'f508fbb3-3ee7-4f4b-9d91-31a343a97504',
            wetlands_csv: '45b0a788-9ca0-48d7-88b0-24ff299f77a2',
            wetlands_xlsm: 'ba274e83-6de3-49c7-85dd-3252cb99dff0',
        }
    };
    var urls = {
        fauna_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.fauna_csv),
        fauna_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.fauna_csv),
            'download',
            'fauna.csv' ]),
        fauna_xlsm: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.fauna_xlsm),
            'download',
            'fauna.xlsm' ]),
        flora_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.flora_csv),
        flora_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.flora_csv),
            'download',
            'flora.csv' ]),
        flora_xlsm: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.flora_xlsm),
            'download',
            'flora.xlsm' ]),
        communities_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.communities_csv),
        communities_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.communities_csv),
            'download',
            'communities.csv' ]),
        communities_xlsm: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.communities_xlsm),
            'download',
            'communities.xlsm' ]),
        wetlands_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.wetlands_csv),
        wetlands_csv: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.wetlands_csv),
            'download',
            'wetlands.csv' ]),
        wetlands_xlsm: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.wetlands_xlsm),
            'download',
            'wetlands.xlsm' ]),
        ibra_geojson: build_url([
            build_ckan_resource_base_url('10b54e2b-7226-4dfb-b3ef-30264cd0670a', 'd32d65a1-7ebe-4457-a208-03fd9f1a456f'),
            'download/ibra7.geojson']),
        ibra_min: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, '27a73c4d-cc2b-4468-a69d-e33f8217a1f4'),
            'download/ibra-min.json']),
        fauna_csv_test: '../data/fauna-master.csv',
        flora_csv_test: '../data/flora-master.csv',
        communities_csv_test: '../data/communities-master.csv',
        wetlands_csv_test: '../data/wetlands-master.csv',
        ibra_geojson_test: '../data/ibra7.geojson',
        ibra_min_test: '../data/ibra-min.json',

        // resources file
        methodology_pdf: build_url([
            build_ckan_resource_base_url(ckan.master_dataset, 'c6378f81-2d68-410f-ba1c-20db21c0bbc6'),
            'download',
            'BAII_methodology.pdf'])
    };

    var config = {
        ckan: ckan,
        urls: urls,
        datasource: 'csv' // [csv|datastore|test] ckan csv files, ckan datastore, test: local files in data folder
    };

    // if local config overrides the default
    require(['config.local'],
        function (local) {
            _.extend(config, local);
        }, function (err) {
            console.log("No local config. Use default.")
        });

    function build_ckan_resource_base_url(dataset, resource_id) {
        return build_url([ckan.base_url, 'dataset', dataset, 'resource', resource_id]);
    }


    function build_url(parts, params) {
        var result = parts.join('/');
        if (params) {
            result += '?' + $.param(params)
        }
        return result;
    }


    return config;
});