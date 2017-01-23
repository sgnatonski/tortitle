import * as azure from "azure-storage";
import * as Promise from "es6-promise";

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

    export function queryEntities<T>(table: string, query: azure.TableQuery) {
        return new Promise.Promise<T[]>((resolve, reject) => {
            tableService.queryEntities(table, query, null, (error, result, response) => {
                if (error) {
                    reject(error);
                } else {
                    var entities = result.entries.map(m => map<any, T>(m));
                    resolve(entities);
                }
            });
        });
    }
}
