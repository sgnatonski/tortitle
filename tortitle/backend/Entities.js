"use strict";
var azure = require("azure-storage");
var es6_promise_1 = require("es6-promise");
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
    function queryEntities(table, query) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            tableService.queryEntities(table, query, null, function (error, result, response) {
                if (error) {
                    reject(error);
                }
                else {
                    var entities = result.entries.map(function (m) { return map(m); });
                    resolve(entities);
                }
            });
        });
    }
    Entities.queryEntities = queryEntities;
})(Entities = exports.Entities || (exports.Entities = {}));
//# sourceMappingURL=Entities.js.map