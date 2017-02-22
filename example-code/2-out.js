for (var i; i < 10; i++) {if (window.CP.shouldStopExecution(1)){break;}
  console.log(i);
}
window.CP.exitedLoop(1);