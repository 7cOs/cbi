import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'Focused tests (fit or fdescribe) forbidden';
  public static PROHIBITED = ['fdescribe', 'fit'];

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoFocusedTestsWalker(sourceFile, this.getOptions()));
  }
}

const regex = new RegExp('^(' + Rule.PROHIBITED.join('|') + ')$');

class NoFocusedTestsWalker extends Lint.RuleWalker {
  public visitCallExpression(node: ts.CallExpression) {
    const match = node.expression.getText().match(regex);

    if (match) {
      this.addFailureAt(node.getStart(), match[0].length, Rule.FAILURE_STRING);
    }

    super.visitCallExpression(node);
  }
}
