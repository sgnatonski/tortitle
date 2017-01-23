"use strict";
var _ = require("lodash");
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
Array.prototype["sortWith"] = function (sortMap, selector, defaultSelector) {
    var sortFunc = sortMap(this);
    var sort = sortFunc[selector] || sortFunc[defaultSelector || 0];
    if (sort == null)
        throw new Error("sortMap function selector does not contain neither given selector " + selector + " or default one");
    return sort();
};
Array.prototype["groupBy"] = function groupBy(keyGetter) {
    return _.groupBy(this, keyGetter);
};
//# sourceMappingURL=utils.js.map