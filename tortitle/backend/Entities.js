"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var azure = require("azure-storage");
var tableService;
var Entities;
(function (Entities) {
    function mapFromEntity(entity) {
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
                var entities = result.entries.map(function (m) { return mapFromEntity(m); });
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
    function updateEntity(table, obj) {
        return new Promise(function (resolve, reject) {
            var entGen = azure.TableUtilities.entityGenerator;
            var task = {
                PartitionKey: entGen.String(obj["PartitionKey"]),
                RowKey: entGen.String(obj["RowKey"])
            };
            tableService.insertOrReplaceEntity(table, task, function (error, result, response) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    Entities.updateEntity = updateEntity;
})(Entities = exports.Entities || (exports.Entities = {}));
//# sourceMappingURL=Entities.js.map