function sumTo(n) {
  return n != 1 ? n + sumTo(n - 1) : n;
}

function sumToLoop(n) {
  var sum = 0;
  for (var i = n; i > 0; )

  {if (window.CP.shouldStopExecution(1)){break;}var result = n;
window.CP.exitedLoop(1);
}
  while (n > 1) {if (window.CP.shouldStopExecution(2)){break;}
    result += --n;
  }
window.CP.exitedLoop(2);

  return result;
}

function sumToFormula(n) {
  return n * (n + 1) / 2;
}


document.write('sumTo: ' + sumTo(10) + '<br />');
document.write('sumToLoop: ' + sumToLoop(10) + '<br />');
document.write('sumToLoop: ' + sumToFormula(10) + '<br />');