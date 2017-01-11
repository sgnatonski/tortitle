"use strict";
var azure = require("azure-storage");
var tableService;
var Entities;
(function (Entities) {
    function map(entity) {
        var mapped = {};
        Object.keys(entity).forEach(function (key) {
            var prop = entity[key];
            mapped[key] = prop ? prop._ : null;
        });
        return mapped;
    }
    function initialize(accountName, accountKey) {
        tableService = azure.createTableService(accountName, accountKey, undefined);
    }
    Entities.initialize = initialize;
    function queryEntities(table, query, callback) {
        tableService.queryEntities(table, query, null, function (error, result, response) {
            if (error) {
                callback(null, error);
            }
            else {
                var entities = result.entries.map(function (m) { return map(m); });
                callback(entities, null);
            }
        });
    }
    Entities.queryEntities = queryEntities;
})(Entities = exports.Entities || (exports.Entities = {}));
//# sourceMappingURL=Entities.js.map