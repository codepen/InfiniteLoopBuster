"use strict";

if (typeof (window.CP) !== "object") {
  window.CP = {};
}

window.CP.PenTimer = {
  // If we successfully run for X seconds no need to continue
  // to monitor because we know the program isn't locked
  programNoLongerBeingMonitored: false,
  timeOfFirstCallToShouldStopLoop: 0,
  _loopExits: {},
  // Keep track of how long program spends in single loop w/o an exit
  _loopTimers: {},

  // Give the program time to get started
  START_MONITORING_AFTER: 2000,
  // takes into account START_MONITORING_AFTER val
  STOP_ALL_MONITORING_TIMEOUT: 5000,
  // tested against pen: xbwYNm, it loops over 200k real loop
  MAX_TIME_IN_LOOP_WO_EXIT: 2200,

  exitedLoop: function(loopID) {
    this._loopExits[loopID] = true;
  },

  shouldStopLoop: function(loopID) {
    // Once we kill a loop, kill them all, we have an infinite loop and
    // it must be fixed prior to running again.
    if (this.programKilledSoStopMonitoring) {
      return true;
    }

    // Program exceeded monitor time, we're in the clear
    if (this.programNoLongerBeingMonitored) {
      return false;
    }

    // If the loopExit already called return
    // It's possible for the program to break out
    if (this._loopExits[loopID]) {
      return false;
    }

    var now = this._getTime();

    if (this.timeOfFirstCallToShouldStopLoop === 0) {
      this.timeOfFirstCallToShouldStopLoop = now;
      // first call to shouldStopLoop so just exit already
      return false;
    }

    var programRunningTime = now - this.timeOfFirstCallToShouldStopLoop;

    // Allow program to run unmolested (yup that's the right word)
    // while it starts up
    if (programRunningTime < this.START_MONITORING_AFTER) {
      return false;
    }

    // Once the program's run for a satisfactory amount of time
    // we assume it won't lock up and we can simply continue w/o
    // checking for infinite loops
    if (programRunningTime > this.STOP_ALL_MONITORING_TIMEOUT) {
      this.programNoLongerBeingMonitored = true;

      return false;
    }

    // Second level shit around new hotness logic
    try {
      this._checkOnInfiniteLoop(loopID, now);
    } catch(e) {
      this._sendErrorMessageToEditor();
      this.programKilledSoStopMonitoring = true;
      return true;
    }

    return false;
  },

  _sendErrorMessageToEditor: function() {
    try {
      if (this._shouldPostMessage()) {
        var data = {
          action: "infinite-loop",
          line: this._findAroundLineNumber()
        };

        parent.postMessage(JSON.stringify(data), "*");
      } else {
        this._throwAnErrorToStopPen();
      }
    } catch(error) {
      this._throwAnErrorToStopPen();
    }
  },

  _shouldPostMessage: function() {
    return document.location.href.match(/boomerang/);
  },

  _throwAnErrorToStopPen: function() {
    throw "We found an infinite loop in your Pen. We've stopped the Pen from running. Please correct it or contact\ support@codepen.io.";
  },

  _findAroundLineNumber: function() {
    var err = new Error();
    var lineNumber = 0;

    if (err.stack) {
      // match only against JS in boomerang
      var m = err.stack.match(/boomerang\S+:(\d+):\d+/);

      if (m) {
        lineNumber = m[1];
      }
    }

    return lineNumber;
  },

  _checkOnInfiniteLoop: function(loopID, now) {
    if (!this._loopTimers[loopID]) {
      this._loopTimers[loopID] = now;
      // We just started the timer for this loop. exit early
      return false;
    }

    var loopRunningTime = now - this._loopTimers[loopID];

    if (loopRunningTime > this.MAX_TIME_IN_LOOP_WO_EXIT) {
      throw "Infinite Loop found on loop: " + loopID;
    }
  },

  _getTime: function() {
    return +new Date();
  }
};

window.CP.shouldStopExecution = function(loopID) {
  var shouldStop = window.CP.PenTimer.shouldStopLoop(loopID);
  if( shouldStop === true ) {
    console.warn("[CodePen]: An infinite loop (or a loop taking too long) was detected, so we stopped its execution. Sorry!");
  }
  return shouldStop;
};

window.CP.exitedLoop = function(loopID) {
  window.CP.PenTimer.exitedLoop(loopID);
};
