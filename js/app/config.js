define([

], function () {
    var ckan = {
        base_url: 'http://internal-data.dpaw.wa.gov.au',
        master_dataset: '63a9cb0f-3d8a-4feb-9c2a-2431f7017d10',
        resources: {
            fauna_datastore: 'e9af8028-a790-4a5c-b713-84eb69298175',
            flora_datastore: 'e9af8028-a790-4a5c-b713-84eb69298175',
            tecpec_datastore: '7bdc88b6-2b78-471c-9f87-e133efeed90e',
            wetland_datastore: 'e9af8028-a790-4a5c-b713-84eb69298175'
        }
    };


    function build_ckan_resource_base_url (dataset, resource_id) {
        return build_url([ckan.base_url, 'dataset', dataset, 'resource', resource_id]);
    }


    function build_url (parts) {
        return parts.join('/')
    }

    return {
        ckan: ckan,
        urls: {
            fauna_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.fauna_datastore),
            flora_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.flora_datastore),
            tecpec_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.tecpec_datastore),
            wetland_datastore: build_ckan_resource_base_url(ckan.master_dataset, ckan.resources.wetland_datastore),
            ibra_geojson: build_url([
                build_ckan_resource_base_url('10b54e2b-7226-4dfb-b3ef-30264cd0670a', 'd32d65a1-7ebe-4457-a208-03fd9f1a456f'),
                'download/ibra7.geojson'])
        }
    };
});