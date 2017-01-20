export { }
declare global {
    interface Array<T> {
        sortBy(name: (o: T) => any): T[];
        sortByDesc(name: (o: T) => any): T[];
        sortWith(sortMap: (arr: T[]) => ISortFuncSelector<T>, selector: number, defaultSelector?: number): T[];
    }

    interface ISortFuncSelector<T> {
        [index: number]: () => T[];
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
    if (sort == null) throw new Error("sortMap function selector does not contain neither given selector " + selector + " or default one");
    return sort();
};