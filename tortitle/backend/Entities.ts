import * as azure from "azure-storage";

var tableService: azure.TableService;

export module Entities {
    interface IEntityProperty<T> {
        _: T;
    }

    function mapFromEntity<TK>(entity): TK {
        var mapped = {} as TK;
        Object.keys(entity).forEach((key) => {
            var prop: IEntityProperty<any> = entity[key];
            mapped[key] = prop ? prop._ : null;
        });
        return mapped;
    }

    export function initialize(accountName: string, accountKey: string) {
        tableService = azure.createTableService(accountName, accountKey, undefined);
    }

    function queryTillEnd<T>(table: string, query: azure.TableQuery, currentToken: azure.TableService.TableContinuationToken, array: T[], resolve, reject) {
        tableService.queryEntities(table, query, currentToken, (error, result, response) => {
            if (error) {
                reject(error);
            } else {
                const entities = result.entries.map(m => mapFromEntity<T>(m));
                
                if (result.continuationToken) {
                    console.log(`getting next page, current array lenght = ${array.length}`);
                    queryTillEnd<T>(table, query, result.continuationToken, array.concat(entities), resolve, reject);
                } else {
                    resolve(array.concat(entities));
                }
            }
        });
    }

    export function queryEntities<T>(table: string, query: azure.TableQuery) {
        return new Promise<T[]>((resolve, reject) => {
            queryTillEnd(table, query, null, [], resolve, reject);
        });
    }

    export function updateEntity<T>(table: string, obj: T) {
        return new Promise<T[]>((resolve, reject) => {
            var entGen = azure.TableUtilities.entityGenerator;
            var task = {
                PartitionKey: entGen.String(obj["PartitionKey"]),
                RowKey: entGen.String(obj["RowKey"])
            };
            tableService.insertOrReplaceEntity(table,
                task,
                (error, result, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
        });
    }
}
