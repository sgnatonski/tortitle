import * as _ from "lodash";

export { }
declare global {
    interface Array<T> {
        sortBy(name: (o: T) => any): T[];
        sortByDesc(name: (o: T) => any): T[];
        sortWith(sortMap: (arr: T[]) => ISortFuncSelector<T>, selector: number, defaultSelector?: number): T[];
        groupBy(keyGetter: (obj: T) => number): IGroupMapNumber<T>;
        groupBy(keyGetter: (obj: T) => string): IGroupMapString<T>;
        first(): T;
        distinct(): T[];
        distinctBy(keyGetter: (obj: T) => any): T[];
        equijoin<TRight, TResult>(foreign: TRight[], primaryKey: (o: T) => any, foreignKey: (o: TRight) => any, select: (left: T, right: TRight) => TResult): TResult[];
    }

    interface ISortFuncSelector<T> {
        [index: number]: () => T[];
    }

    interface IGroupMapString<T> {
        [index: string]: T[];
    }

    interface IGroupMapNumber<T> {
        [index: number]: T[];
    }
}

var varExtractor = new RegExp("return (.*);");
function getVariableName<TResult>(name: (o: TResult) => TResult) {
    var m = varExtractor.exec(name + "");
    if (m == null) throw new Error("The function does not contain a statement matching 'return variableName;'");
    var fullMemberName = m[1];
    var memberParts = fullMemberName.split('.');
    return memberParts[memberParts.length - 1];
}

Array.prototype["sortBy"] = function <TResult>(name: (o: TResult) => any): TResult[] {
    let variable = getVariableName(name);
    return this.sort((a, b) => a[variable] < b[variable] ? -1 : a[variable] > b[variable] ? 1 : 0);
};

Array.prototype["sortByDesc"] = function <TResult>(name: (o: TResult) => any): TResult[] {
    let variable = getVariableName(name);
    return this.sort((a, b) => a[variable] < b[variable] ? 1 : a[variable] > b[variable] ? -1 : 0);
};

Array.prototype["sortWith"] = function <TResult>(sortMap: (arr: TResult[]) => ISortFuncSelector<TResult>, selector: number, defaultSelector?: number): TResult[] {
    var sortFunc = sortMap(this);
    var sort = sortFunc[selector] || sortFunc[defaultSelector || 0];
    if (sort == null) throw new Error(`sortMap function selector does not contain neither given selector ${selector} or default one`);
    return sort();
};

Array.prototype["groupBy"] = function groupBy<TResult>(keyGetter: (obj: TResult) => string | number) {
    return _.groupBy(this, keyGetter);
}

Array.prototype["distinct"] = function distinct<TResult>() {
    return _.uniq(this);
}

Array.prototype["distinctBy"] = function distinctBy<TResult>(keyGetter: (obj: TResult) => any) {
    return _.uniqBy(this, keyGetter);
}

Array.prototype["first"] = function first<TResult>() {
    return _.first(this);
}

Array.prototype["equijoin"] = function equijoin<TRight, TResult>(foreign: TRight[], primaryKey: (o) => any, foreignKey: (o: TRight) => any, select: (left, right: TRight) => TResult): TResult[] {
    var m = this.length, n = foreign.length, index = [], c = [];
    let variableLeft = getVariableName(primaryKey);
    let variableRight = getVariableName(foreignKey);

    for (var i = 0; i < m; i++) {
        var row = this[i];
        index[row[variableLeft]] = row;
    }

    for (var j = 0; j < n; j++) {
        var y = foreign[j];
        var x = index[y[variableRight]];
        if (x && y) {
            c.push(select(x, y));
        }
    }

    return c;
}