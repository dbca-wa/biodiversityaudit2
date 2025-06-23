define(["underscore", "jquery"], function (_, $) {
	var ckan = {
		// static_url: '//static.dbca.wa.gov.au/static/biodiversityaudit',
		static_url: "//data.bio.wa.gov.au/dataset",
		base_url: "//data.dpaw.wa.gov.au",
		master_dataset: "63a9cb0f-3d8a-4feb-9c2a-2431f7017d10",
		resources: {
			fauna_csv: "e9af8028-a790-4a5c-b713-84eb69298175",
			fauna_xlsm: "ff8f7b33-2beb-4577-96d2-53bc9fb92fd0",
			flora_csv: "9d9cda48-c08c-4de1-9339-789b8dc3c431",
			flora_xlsm: "d91ae791-83ee-4c83-994f-a329e8f6e6b8",
			communities_csv: "7bdc88b6-2b78-471c-9f87-e133efeed90e",
			communities_xlsm: "f508fbb3-3ee7-4f4b-9d91-31a343a97504",
			wetlands_csv: "99cb8471-0499-4548-9a77-ac0e720ca8be",
			wetlands_xlsm: "",
		},
	};

	// Note url field supposes starts with https://data.bio.wa.gov.au/dataset/
	region_pdfs = {
		AVW01: {
			url: "824e1cc2-a76f-457b-81dc-2c60e50c9a52/resource/1dff82a8-eeda-4a5b-9b9b-1e6e53dc2f18/download/sub-region-profile-reporting-tables-avw01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-avw01",
		},
		AVW02: {
			url: "fd0c3aa5-89bd-4103-9f12-77756f9e4f5d/resource/0a459b49-1e66-424e-ad51-99303c8fd277/download/sub-region-profile-reporting-tables-avw02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-avw02",
		},
		CAR01: {
			url: "21949e50-19a8-474c-a85a-e9ecf5480fa9/resource/5c6a5a9b-7c98-47d1-a0bb-883e0f2163ba/download/sub-region-profile-reporting-tables-car01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-car01",
		},
		CAR02: {
			url: "cd4c1130-a80a-462e-8a79-c3b51744751e/resource/b4028462-7473-49d2-95a1-73d858cd6e4f/download/sub-region-profile-reporting-tables-car02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-car02",
		},
		CEK01: {
			url: "8e380b43-8498-4ca7-8241-0bce2c86645a/resource/a72938d3-1d76-4602-a07b-7bde7641a811/download/sub-region-profile-reporting-tables-cek01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-cek01",
		},
		CEK02: {
			url: "0939e2a6-bfc0-484f-bc90-b5320c32d038/resource/041f7369-b371-4676-9d9c-1456a19ef502/download/sub-region-profile-reporting-tables-cek02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-cek02",
		},
		CEK03: {
			url: "3788c0f7-4590-4894-8a83-63de90476139/resource/6db73bef-de88-4fb2-a423-968a24d4421f/download/sub-region-profile-reporting-tables-cek03.pdf",
			fallback_file: "sub-region-profile-reporting-tables-cek03",
		},
		CER01: {
			url: "c2428ebe-929a-4b4d-8da2-fe3b26f11a86/resource/d57a9959-7409-449c-8ef7-1d096ab50d90/download/sub-region-profile-reporting-tables-cer01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-cer01",
		},
		COO01: {
			url: "a8f0485a-615c-44c2-9306-29b28bcab73a/resource/1fbc25af-76a8-42ee-92b6-91651a2295cb/download/sub-region-profile-reporting-tables-coo01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-coo01",
		},
		COO02: {
			url: "550bf062-3e00-45f0-8c78-4cafde516a37/resource/df8a7e5a-4a3c-4db4-807a-2d3f3908f528/download/sub-region-profile-reporting-tables-coo02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-coo02",
		},
		COO03: {
			url: "683540cd-6a03-487a-99c6-94665f7fd77a/resource/4454016f-0fe4-4820-9f5f-6d39feeb5aec/download/sub-region-profile-reporting-tables-coo03.pdf",
			fallback_file: "sub-region-profile-reporting-tables-coo03",
		},
		DAL01: {
			url: "b04e0c7b-37f6-457a-9d48-4a34b5caba82/resource/9fe8c132-3d69-4936-9e50-8da2c054f6fe/download/sub-region-profile-reporting-tables-dal01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-dal01",
		},
		DAL02: {
			url: "e3477bd1-c614-46eb-ae7c-dddef703e85f/resource/13dde151-f8fc-40e8-9ab1-16a4fb049d9a/download/sub-region-profile-reporting-tables-dal02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-dal02",
		},
		ESP01: {
			url: "a4366d5b-0c4b-49e8-b157-0314f99a2079/resource/822d07a8-fc3c-4284-8005-e51a2b1c8620/download/sub-region-profile-reporting-tables-esp01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-esp01",
		},
		ESP02: {
			url: "e5b88475-6616-4510-b76c-7a59e6ae7278/resource/57eea877-224b-43ef-81f3-d2e814a5c085/download/sub-region-profile-reporting-tables-esp02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-esp02",
		},
		GAS01: {
			url: "d5144dca-c4b4-4ac0-8c72-5708639bbfd9/resource/664a89bf-18e4-470e-b5b1-0b0f16ad1f66/download/sub-region-profile-reporting-tables-gas01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gas01",
		},
		GAS02: {
			url: "9e4f13c6-7714-49a8-a5bb-4d50baec6775/resource/f6c2da22-a89b-4ad3-ac3a-1e353dffb437/download/sub-region-profile-reporting-tables-gas02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gas02",
		},
		GAS03: {
			url: "e69b8501-a492-4184-8c58-e6ad31670c76/resource/54ea24ca-84dc-4f57-a4e9-f0c46a5110e2/download/sub-region-profile-reporting-tables-gas03.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gas03",
		},
		GES01: {
			url: "b2b6bdd1-a7cf-49f9-aaa2-b27e90ae3553/resource/a3f4e21d-2cb1-41f6-8287-91879570dad0/download/sub-region-profile-reporting-tables-ges01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-ges01",
		},
		GES02: {
			url: "1a6a27e9-0f9d-4ae9-853d-796a807952d7/resource/78b5c135-deb3-4a53-aace-9e4d6a1d0a5f/download/sub-region-profile-reporting-tables-ges02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-ges02",
		},
		GID01: {
			url: "b6afbe60-5921-413a-876a-7aac6939ef97/resource/951541d9-7ad1-4bb4-890c-0e3e7b19efba/download/sub-region-profile-reporting-tables-gid01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gid01",
		},
		GID02: {
			url: "7d3d30d7-5527-443f-9f37-c73a4ce0c070/resource/a669e426-6b45-4966-9d49-c564d506de0a/download/sub-region-profile-reporting-tables-gid02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gid02",
		},
		GSD01: {
			url: "f9645a30-3de4-4bff-99dc-93c2f07bd68f/resource/51422978-8699-4c07-bca6-a6a0af033ed1/download/sub-region-profile-reporting-tables-gsd01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gsd01",
		},
		GSD02: {
			url: "3569bdee-f925-41ef-a6d8-2435c87349d5/resource/18eaa9f8-b841-4d50-9337-d0d6549c4a45/download/sub-region-profile-reporting-tables-gsd02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gsd02",
		},
		GVD01: {
			url: "63f887c1-3798-4c35-8b67-c3d275669d98/resource/17ba5212-eb0c-4172-813b-5cf21c21a7eb/download/sub-region-profile-reporting-tables-gvd01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gvd01",
		},
		GVD02: {
			url: "4d832924-cb47-48e9-823c-c0722770f7d4/resource/542c005a-5be8-48d4-b11e-0398ecc587b7/download/sub-region-profile-reporting-tables-gvd02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gvd02",
		},
		GVD03: {
			url: "65fbcb89-59ad-440e-8252-6ad9e0cddb1d/resource/74972e56-6836-4759-921b-70657c9214b1/download/sub-region-profile-reporting-tables-gvd03.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gvd03",
		},
		GVD04: {
			url: "9f7247d7-4a5e-482b-bf06-d42a88f3b33e/resource/0a089be0-7aef-4b3f-924e-e9e9857c7e58/download/sub-region-profile-reporting-tables-gvd04.pdf",
			fallback_file: "sub-region-profile-reporting-tables-gvd04",
		},
		HAM01: {
			url: "84255d2b-17e1-4554-8018-017e03342681/resource/ae9982af-1fb1-4d44-996a-8e9046e1f125/download/sub-region-profile-reporting-tables-ham01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-ham01",
		},
		ITI03: {
			url: "ba4f0eeb-bf30-40c8-9175-944aa3dc08c8/resource/5c8b2145-8e28-4001-b23e-ee6a717f9463/download/sub-region-profile-reporting-tables-iti03.pdf",
			fallback_file: "sub-region-profile-reporting-tables-iti03",
		},
		JAF01: {
			url: "22b0f963-4f09-4a8a-9c11-b4506616c924/resource/5b6670df-4b09-44ce-b201-42a54f6d9029/download/sub-region-profile-reporting-tables-jaf01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-jaf01",
		},
		JAF02: {
			url: "bf8b170b-adba-4220-8e4a-3dce5bbb5d26/resource/a8cd3643-07b1-4a9f-8c0e-4fe58f6e2136/download/sub-region-profile-reporting-tables-jaf02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-jaf02",
		},
		LSD01: {
			url: "e310a3e9-0659-4f1d-bd18-2c01784af89e/resource/0c874f78-7f93-4313-8f55-71ca480ea656/download/sub-region-profile-reporting-tables-lsd01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-lsd01",
		},
		LSD02: {
			url: "8081d444-0bdf-4de5-97f6-c1640ac1fd20/resource/8e6086d4-f742-440e-9f63-7f69db9ca8ac/download/sub-region-profile-reporting-tables-lsd02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-lsd02",
		},
		MAL01: {
			url: "03c35c57-78aa-41ad-b01b-81bf3b76ee33/resource/4e1f4285-294a-45ad-9ec3-27f3edc76538/download/sub-region-profile-reporting-tables-mal01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-mal01",
		},
		MAL02: {
			url: "4caef802-06d3-45bf-92bf-695ecb40f2c1/resource/bb337d8a-bb05-4866-9a11-5cd89a1055b1/download/sub-region-profile-reporting-tables-mal02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-mal02",
		},
		MUR01: {
			url: "63a9cb0f-3d8a-4feb-9c2a-2431f7017d10/resource/03ddd84f-6612-4175-bd94-52484dc4f221/download/sub-region-profile-reporting-tables-mur01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-mur01",
		},
		MUR02: {
			url: "c80153ba-25c6-4f63-a397-2b6fab3f467a/resource/f0b787ea-b5b0-4dcb-8a01-685b3ae6ceb2/download/sub-region-profile-reporting-tables-mur02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-mur02",
		},
		NOK01: {
			url: "db9e3e81-62d3-454e-b185-17c7f7d43514/resource/21f74bdb-b462-48d7-8405-dc0501bb51d4/download/sub-region-profile-reporting-tables-nok01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-nok01",
		},
		NOK02: {
			url: "170f47be-f1d3-45fa-8def-abb61dbb426a/resource/15aa1eb7-58c0-4a9f-8c6e-3247502cc2f1/download/sub-region-profile-reporting-tables-nok02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-nok02",
		},
		NUL01: {
			url: "4b1bd379-6e84-4dcd-ad4b-1cfeea89d0ea/resource/4a2887f5-b4e6-4555-9212-72a2a4041587/download/sub-region-profile-reporting-tables-nul01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-nul01",
		},
		NUL02: {
			url: "d3083330-7969-4bfd-b699-e88ac5685fa4/resource/d97321d7-702d-4f17-ab16-a79230505d18/download/sub-region-profile-reporting-tables-nul02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-nul02",
		},
		OVP01: {
			url: "61689b52-f359-45f9-9904-0e226dec99ed/resource/a9d33112-334b-44ea-9dfb-18368de18618/download/sub-region-profile-reporting-tables-ovp01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-ovp01",
		},
		OVP02: {
			url: "dd57e5e0-a078-4049-a787-f4bfd4f72a87/resource/19b66259-1275-4d39-a3fc-890a92d2865f/download/sub-region-profile-reporting-tables-ovp02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-ovp02",
		},
		PIL01: {
			url: "7109fc9d-b67a-4df1-aee5-4cf01985454e/resource/b52babbe-30f7-4744-b4eb-e0227f1c58ab/download/sub-region-profile-reporting-tables-pil01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-pil01",
		},
		PIL02: {
			url: "25a1c984-ee8d-4e29-b0de-1544b8eee175/resource/d953494e-1c0c-43c9-b876-3645e6e71f73/download/sub-region-profile-reporting-tables-pil02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-pil02",
		},
		PIL03: {
			url: "1794ec5b-9dff-421f-9d85-dc0d2b4d5fc9/resource/a7ae67e3-6a6c-4fc5-ba8b-67d9fd37517b/download/sub-region-profile-reporting-tables-pil03.pdf",
			fallback_file: "sub-region-profile-reporting-tables-pil03",
		},
		PIL04: {
			url: "24b63cdb-a839-4606-972c-a5d4784cb6a1/resource/803f6a57-1d3a-4d07-a6a3-b196c6718527/download/sub-region-profile-reporting-tables-pil04.pdf",
			fallback_file: "sub-region-profile-reporting-tables-pil04",
		},
		SWA01: {
			url: "f142bfd4-3c78-46fb-a62c-9b4168d2f899/resource/1e79b190-c428-452c-a474-0371b8c73979/download/sub-region-profile-reporting-tables-swa01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-swa01",
		},
		SWA02: {
			url: "b8938710-5122-4e50-9eca-872ba3142799/resource/7ae048a6-88f2-45d1-b021-87967c8a260c/download/sub-region-profile-reporting-tables-swa02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-swa02",
		},
		TAN01: {
			url: "f1c770d4-dd98-4af2-b2cd-a3c13b542ff5/resource/e13ebd42-b658-427c-a9b0-c7b10cb58c78/download/sub-region-profile-reporting-tables-tan01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-tan01",
		},
		VIB01: {
			url: "4db02ec2-c5ee-4b85-81a9-213861877132/resource/1964dae7-2f13-4a10-abd4-19eb4f1cf36f/download/sub-region-profile-reporting-tables-vib01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-vib01",
		},
		WAR01: {
			url: "4e71048b-f652-44b1-831e-5657c40c1e9b/resource/d2640022-2c32-40aa-bee6-07db1a4ae6ef/download/sub-region-profile-reporting-tables-war01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-war01",
		},
		YAL01: {
			url: "519537b5-64c1-48d1-9c6b-a69c4a54ec9b/resource/f9262446-3312-4ae3-9472-10065ee65961/download/sub-region-profile-reporting-tables-yal01.pdf",
			fallback_file: "sub-region-profile-reporting-tables-yal01",
		},
		YAL02: {
			url: "28862424-7f21-4614-86e6-f14d347c9b95/resource/c7882e28-fcd1-447f-9f74-26d16befd9f4/download/sub-region-profile-reporting-tables-yal02.pdf",
			fallback_file: "sub-region-profile-reporting-tables-yal02",
		},
	};

	// sub-region-profile-reporting-tables-war01.pdf
	// Sub-Region-Profile-Reporting-Tables-WAR01.pdf

	var urls = {
		spatial_profile_basename: build_url([
			ckan.static_url,
			"Sub-Region-Profile-Reporting-Tables-",
		]),
		fauna_datastore: build_ckan_resource_base_url(
			ckan.master_dataset,
			ckan.resources.fauna_csv
		),
		fauna_csv: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.fauna_csv
			),
			"download",
			"fauna.csv",
		]),
		fauna_xlsm: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.fauna_xlsm
			),
			"download",
			"fauna.xlsm",
		]),
		flora_datastore: build_ckan_resource_base_url(
			ckan.master_dataset,
			ckan.resources.flora_csv
		),
		flora_csv: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.flora_csv
			),
			"download",
			"flora.csv",
		]),
		flora_xlsm: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.flora_xlsm
			),
			"download",
			"flora.xlsm",
		]),
		communities_datastore: build_ckan_resource_base_url(
			ckan.master_dataset,
			ckan.resources.communities_csv
		),
		communities_csv: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.communities_csv
			),
			"download",
			"communities.csv",
		]),
		communities_xlsm: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.communities_xlsm
			),
			"download",
			"communities.xlsm",
		]),
		wetlands_datastore: build_ckan_resource_base_url(
			ckan.master_dataset,
			ckan.resources.wetlands_csv
		),
		wetlands_csv: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.wetlands_csv
			),
			"download",
			"wetlands.csv",
		]),
		wetlands_xlsm: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				ckan.resources.wetlands_xlsm
			),
			"download",
			"wetlands.xlsm",
		]),
		ibra_geojson: build_url([
			build_ckan_resource_base_url(
				"10b54e2b-7226-4dfb-b3ef-30264cd0670a",
				"d32d65a1-7ebe-4457-a208-03fd9f1a456f"
			),
			"download/ibra7.geojson",
		]),
		ibra_min: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				"27a73c4d-cc2b-4468-a69d-e33f8217a1f4"
			),
			"download/ibra-min.json",
		]),
		fauna_csv_test: "../data/fauna-master.csv",
		flora_csv_test: "../data/flora-master.csv",
		communities_csv_test: "../data/communities-master.csv",
		wetlands_csv_test: "../data/wetlands-master.csv",
		ibra_geojson_test: "../data/ibra7.geojson",
		ibra_min_test: "../data/ibra-min.json",

		// resources file
		methodology_pdf: build_url([
			build_ckan_resource_base_url(
				ckan.master_dataset,
				"c6378f81-2d68-410f-ba1c-20db21c0bbc6"
			),
			"download",
			"BAII_methodology.pdf",
		]),
	};

	var isPublic = false; // dbca-wa/biodiversityaudit2/issues/10

	var config = {
		ckan: ckan,
		urls: urls,
		region_pdfs: region_pdfs,
		isPublic: isPublic, //  dbca-wa/biodiversityaudit2/issues/10
		datasource: "test", // [csv|datastore|test] ckan csv files, ckan datastore, test: local files in data folder
	};

	// if local config overrides the default
	require(["config.local"], function (local) {
		_.extend(config, local);
	}, function (err) {
		console.log("No local config. Using default.");
	});

	function build_ckan_resource_base_url(dataset, resource_id) {
		return build_url([
			ckan.base_url,
			"dataset",
			dataset,
			"resource",
			resource_id,
		]);
	}

	function build_url(parts, params) {
		var result = parts.join("/");
		if (params) {
			result += "?" + $.param(params);
		}
		return result;
	}

	return config;
});
