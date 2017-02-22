var esprima = require('esprima');

function instrument(code) {
  var LOOP_CHECK = 'if (window.CP.shouldStopExecution(%d)){break;}';
  var LOOP_EXIT = "\nwindow.CP.exitedLoop(%d);\n";

  var loopId = 1;
  var patches = [];

  esprima.parse(code, {
    range: true,
    tolerant: false,
    sourceType: "script",
    jsx: true
  }, function (node) {
    switch (node.type) {
    case 'DoWhileStatement':
    case 'ForStatement':
    case 'ForInStatement':
    case 'ForOfStatement':
    case 'WhileStatement':
      var start = 1 + node.body.range[0];
      var end = node.body.range[1];
      var prolog = LOOP_CHECK.replace('%d', loopId);
      var epilog = '';

      if (node.body.type !== 'BlockStatement') {
        // `while(1) doThat()` becomes `while(1) {doThat()}`
        prolog = '{' + prolog;
        epilog = '}';
        --start;
      }

      patches.push({ pos: start, str: prolog });
      patches.push({ pos: end, str: epilog });
      patches.push({ pos: node.range[1], str: LOOP_EXIT.replace('%d', loopId) });
      ++loopId;
      break;

    default:
      break;
    }
  });

  patches.sort(function (a, b) {
    return b.pos - a.pos;
  }).forEach(function (patch) {
    code = code.slice(0, patch.pos) + patch.str + code.slice(patch.pos);
  });

  return code;
}

exports.handler = function(event, context) {

  try {

    var js = event.markup || "";

    if (js === "") {
      context.succeed({
        "markup": ""
      });
    } else {
      context.succeed({
        "markup": instrument(event.markup)
      });
    }

  } catch(e) {

    var line = 1;

    try {
      line = e.lineNumber;
    } catch(err) {
      // go on with line number 1
    }

    context.succeed({
      "error": e.description,
      "line": line
    });

  }

};
