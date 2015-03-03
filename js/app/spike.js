define([
        'jquery',
        'underscore',
        'backbone',
        '../models/faunaSpeciesList',
    ],
    function ($, _, Backbone, SpeciesList) {


        var species = new SpeciesList();

        window.species = species;
        return {
            species: species
        };


    });