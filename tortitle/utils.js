"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
}
exports.atob = atob;
function btoa(str) {
    var s = str || "";
    var buffer;
    if (s instanceof Buffer) {
        buffer = s;
    }
    else {
        buffer = new Buffer(s.toString(), 'binary');
    }
    return buffer.toString('base64');
}
exports.btoa = btoa;
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
Array.prototype["distinct"] = function distinct() {
    return _.uniq(this);
};
Array.prototype["distinctBy"] = function distinctBy(keyGetter) {
    return _.uniqBy(this, keyGetter);
};
Array.prototype["first"] = function first() {
    return _.first(this);
};
Array.prototype["equijoin"] = function equijoin(foreign, primaryKey, foreignKey, select) {
    var m = this.length, n = foreign.length, index = [], c = [];
    var variableLeft = getVariableName(primaryKey);
    var variableRight = getVariableName(foreignKey);
    for (var i = 0; i < m; i++) {
        var row = this[i];
        index[row[variableLeft].toLowerCase()] = row;
    }
    for (var j = 0; j < n; j++) {
        var y = foreign[j];
        var x = index[y[variableRight].toLowerCase()];
        if (x && y) {
            c.push(select(x, y));
        }
    }
    return c;
};
Array.prototype["mapAssign"] = function mapAssign(keyGetter) {
    return this.map(function (x) { return _.assign(x, keyGetter(x)); });
};
//# sourceMappingURL=utils.js.map