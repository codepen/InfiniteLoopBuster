# Infinite Loop Buster!

Stop infinite loops before they happen.
 
This takes a string of JavaScript and alters it to ensure that infinite loops are broken, but otherwise doesn't affect the code. The purpose is so you can run it without fear of freezing the browser. Online code editors like CodePen are the use-case.

This uses Esprima to create an abstract syntax tree out of the JavaScript and do the instrumenting. Esprima is the only dependency, it doesn't require any additional libraries to output back to a string of JavaScript.
