export default function ({ types: t }) {
  const findLine = (path, node) => {
    if (node && node.loc) return [node.loc.start.line, node.loc.end.line];

    if (!path) return -1;

    if (path.node.loc)
      return [path.node.loc.start.line, path.node.loc.end.line];
    else return findLine(path.parentPath);
  };

  const createWaitNode = ([lineStart = -1, lineEnd = -1], descNum = -1) => {
    return t.awaitExpression(
      t.callExpression(t.identifier("wait"), [
        t.objectExpression([
          t.objectProperty(
            t.identifier("line"),
            t.arrayExpression([
              t.numericLiteral(lineStart),
              t.numericLiteral(lineEnd),
            ])
          ),
          t.objectProperty(t.identifier("desc"), t.numericLiteral(descNum)),
        ]),
      ])
    );
  };

  return {
    name: "senki-wait",
    visitor: {
      Program(path) {
        let len = path.node.body.length;
        for (let i = 0; i < len; i++) {
          path.node.body.splice(
            i * 2 + 1,
            0,
            createWaitNode(findLine(path, path.node.body[i * 2]))
          );
        }
      },
      ArrowFunctionExpression(path) {
        if (t.isExpression(path.node.body)) {
          path
            .get("body")
            .replaceWith(t.blockStatement([t.returnStatement(path.node.body)]));
        }
      },
      Statement(path) {
        if (t.isBlockStatement(path.node)) return;
        if (t.isBreakStatement(path.node)) return;

        const parentNode = path.parentPath.node;

        if (t.isWithStatement(parentNode)) {
          path.replaceWith(t.blockStatement([path.node]));
        }

        if (t.isIfStatement(parentNode)) {
          path.replaceWith(t.blockStatement([path.node]));
        }

        if (t.isWhileStatement(parentNode)) {
          path.replaceWith(t.blockStatement([path.node]));
        }

        if (t.isDoWhileStatement(parentNode)) {
          path.replaceWith(t.blockStatement([path.node]));
        }

        if (t.isForStatement(parentNode)) {
          path.replaceWith(t.blockStatement([path.node]));
        }

        if (t.isForInStatement(parentNode)) {
          path.replaceWith(t.blockStatement([path.node]));
        }

        if (t.isSwitchCase(parentNode)) {
          path.replaceWith(t.blockStatement([path.node]));
        }
      },
      BlockStatement(path) {
        if (path.parentPath.node.kind === "constructor") return;
        let len = path.node.body.length;
        for (let i = 0; i < len; i++) {
          path.node.body.splice(
            i * 2,
            0,
            createWaitNode(findLine(path, path.node.body[i * 2 - 1]))
          );
        }
        if (!t.isReturnStatement(path.node.body[len * 2 - 1]))
          path.node.body.splice(
            len * 2,
            0,
            createWaitNode(findLine(path, path.node.body[len * 2 - 1]))
          );
      },
      Function(path) {
        if (path.node.kind === "constructor") return;
        path.node.async = true;
      },
      CallExpression(path) {
        let parent = path.parentPath;
        while (parent) {
          if (parent.node.kind === "constructor") return;
          parent = parent.parentPath;
        }
        if (!t.isAwaitExpression(path.parentPath.node))
          path.replaceWith(t.awaitExpression(path.node))
      }
    },
  };
};
