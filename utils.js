"use strict";
var varExtractor = new RegExp("return (.*);");
function getVariableName(name) {
    var m = varExtractor.exec(name + "");
    if (m == null)
        throw new Error("The function does not contain a statement matching 'return variableName;'");
    var fullMemberName = m[1];
    var memberParts = fullMemberName.split('.');
    return memberParts[memberParts.length - 1];
}
Array.prototype["sortBy"] = function (name) {
    var variable = getVariableName(name);
    return this.sort(function (a, b) { return a[variable] < b[variable] ? -1 : a[variable] > b[variable] ? 1 : 0; });
};
Array.prototype["sortByDesc"] = function (name) {
    var variable = getVariableName(name);
    return this.sort(function (a, b) { return a[variable] < b[variable] ? 1 : a[variable] > b[variable] ? -1 : 0; });
};
Array.prototype["sortWith"] = function (func, selector) {
    return func(this, selector)();
};
String.prototype["uberTrim"] = function () {
    return this.length >= 2 && (this[0] === this[this.length - 1])
        ? this.slice(1, -1).trim()
        : this;
};
//# sourceMappingURL=utils.js.map