var assert = require("assert");
var fs = require("fs");
var app = require("../app.js");

/* globals beforeEach */

function call(file) {
  return fs.readFileSync("example-code/" + file, "utf8");
}

function assertCompiledEqualToFileContent(compiled, file) {
  assert.equal(compiled.replace(/\s+$/, ''), call(file).replace(/\s+$/, ''));
}

function compareInputFileToOutputFile(inputFile, outputFile) {
  var compiled;

  beforeEach(function(done) {
    app.handler({
      markup: call(inputFile)
    }, {
      succeed: function(result) {
        compiled = result.markup;
        done();
      }
    });
  });

  it('Should ...', function() {
    assertCompiledEqualToFileContent(compiled, outputFile);
  });
}

describe('Test #1) Allows Restructuring', function() {
  compareInputFileToOutputFile('1-in.js', '1-out.js');
});

describe('Test #2) Inject Self into `for` Loop', function() {
  compareInputFileToOutputFile('2-in.js', '2-out.js');
});

describe('Test #3) Should Allow and Return Template Literals', function() {
  compareInputFileToOutputFile('3-in.js', '3-out.js');
});

describe('Test #4) Should Stop For Loop Without End Condition', function() {
  compareInputFileToOutputFile('4-in.js', '4-out.js');
});

describe('Test #5) Deal With Nested `for` loops', function() {
  compareInputFileToOutputFile('5-in.js', '5-out.js');
});

describe('Test #6) Deal With Malformed JavaScript', function() {
  var raw = call("6-in.js");
  var compiled;
  var expectedOutput = {
    "error": "Unexpected token {",
    "line": 1
  };

  beforeEach(function(done) {
    raw =
    app.handler({
      markup: raw
    }, {
      succeed: function(result) {
        compiled = result;
        done();
      }
    });

  });

  it('Should ...', function() {
    assert.equal(compiled.error, expectedOutput.error);
  });

});

describe('Test #7) Deal With Minified JavaScript', function() {
  compareInputFileToOutputFile('7-in.js', '7-out.js');
});
