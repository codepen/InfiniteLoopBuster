for (var x = 0; i < 10; x++) {if (window.CP.shouldStopExecution(2)){break;}
  for (var y = 0; y < 10; y++) {if (window.CP.shouldStopExecution(1)){break;}
    if (x === y) {

    } else if (x === 3) {

    }
  }
window.CP.exitedLoop(1);

}
window.CP.exitedLoop(2);