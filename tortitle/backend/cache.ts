import * as Cache from "node-cache";
import { Promise } from "es6-promise";

Cache.prototype["getAsync"] = function <T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        (this as Cache).get<T>(key,
            (error, value) => {
                if (error) reject(error);
                else resolve(value);
            });
    });
};

Cache.prototype["setAsync"] = function <T>(key: string, value: T, ttl?: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        (this as Cache).set<T>(key, value, ttl,
            (error, success) => {
                if (error) reject(error);
                else resolve(success ? value : null);
            });
    });
};

interface ICache extends Cache {
    getAsync<T>(key: string): Promise<T>;
    setAsync<T>(key: string, value: T, ttl?: number): Promise<T>;
}

const cache = new Cache({ stdTTL: 60, checkperiod: 120 }) as ICache;

export = cache;