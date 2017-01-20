export { }
declare global {
    interface Array<T> {
        sortBy(name: (o: T) => any): T[];
        sortByDesc(name: (o: T) => any): T[];
        sortWith(func: (arr: T[], sel: any) => () => T[], selector: any): T[];
    }

    interface String {
        uberTrim(): string;
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

Array.prototype["sortWith"] = function <TResult>(func: (arr: TResult[], sel: any) => () => TResult[], selector: any): TResult[] {
    return func(this, selector)();
};

String.prototype["uberTrim"] = function() {
    return this.length >= 2 && (this[0] === this[this.length - 1])
        ? this.slice(1, -1).trim()
        : this;
};