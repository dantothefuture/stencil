import ts from 'typescript';


export function removeStencilImports(): ts.TransformerFactory<ts.SourceFile> {

  return transformCtx => {

    function visitImport(importNode: ts.ImportDeclaration) {
      if (importNode.moduleSpecifier &&
          ts.isStringLiteral(importNode.moduleSpecifier) &&
          importNode.moduleSpecifier.text === '@stencil/core') {
        return null;
      }

      return importNode;
    }


    function visit(node: ts.Node): ts.VisitResult<ts.Node> {
      switch (node.kind) {
        case ts.SyntaxKind.ImportDeclaration:
          return visitImport(node as ts.ImportDeclaration);
        default:
          return ts.visitEachChild(node, visit, transformCtx);
      }
    }

    return (tsSourceFile) => {
      return visit(tsSourceFile) as ts.SourceFile;
    };
  };
}
