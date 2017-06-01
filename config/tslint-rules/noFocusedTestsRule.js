"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new NoFocusedTestsWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.FAILURE_STRING = 'Focused tests (fit or fdescribe) forbidden';
Rule.PROHIBITED = ['fdescribe', 'fit'];
exports.Rule = Rule;
var regex = new RegExp('^(' + Rule.PROHIBITED.join('|') + ')$');
// tslint:disable-next-line:max-classes-per-file
var NoFocusedTestsWalker = (function (_super) {
    __extends(NoFocusedTestsWalker, _super);
    function NoFocusedTestsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoFocusedTestsWalker.prototype.visitCallExpression = function (node) {
        var match = node.expression.getText().match(regex);
        if (match) {
            this.addFailureAt(node.getStart(), match[0].length, Rule.FAILURE_STRING);
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    return NoFocusedTestsWalker;
}(Lint.RuleWalker));
