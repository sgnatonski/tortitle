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
    function queryTillEnd(table, query, currentToken, array, resolve, reject) {
        tableService.queryEntities(table, query, currentToken, function (error, result, response) {
            if (error) {
                reject(error);
            }
            else {
                var entities = result.entries.map(function (m) { return map(m); });
                if (result.continuationToken) {
                    console.log("getting next page, current array lenght = " + array.length);
                    queryTillEnd(table, query, result.continuationToken, array.concat(entities), resolve, reject);
                }
                else {
                    resolve(array.concat(entities));
                }
            }
        });
    }
    function queryEntities(table, query) {
        return new Promise(function (resolve, reject) {
            queryTillEnd(table, query, null, [], resolve, reject);
        });
    }
    Entities.queryEntities = queryEntities;
})(Entities = exports.Entities || (exports.Entities = {}));
//# sourceMappingURL=Entities.js.map