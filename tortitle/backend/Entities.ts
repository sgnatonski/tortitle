import * as azure from "azure-storage";
import { Promise, Thenable } from "es6-promise";

var tableService: azure.TableService;

export module Entities {
    interface IEntityProperty<T> {
        _: T;
    }

    function map<T, TK>(entity: T): TK {
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
                var entities = result.entries.map(m => map<any, T>(m));
                
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
}
