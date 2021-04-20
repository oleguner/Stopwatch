import React, { useEffect, useState } from 'react';
import {
  interval,
  Subject,
  fromEvent,
} from 'rxjs';
import {
  takeUntil,
} from 'rxjs/operators';

import './App.css';

function App() {
  const [time, setTime] = useState(0);
  const [isTimerOn, setTimerOn] = useState(false);
  const [startStopBtn, setStartStopBtn] = useState();

  const handleClick = () => {
    setTimerOn(!isTimerOn);
  };

  const handleWait = () => {
    if (time !== 0) {
      setTimerOn(false);
    }
  };

  const handleReset = () => {
    setTime(0);
    setTimerOn(true);
  };

  useEffect(() => {
    if (isTimerOn) {
      setStartStopBtn('Stop');
    } else {
      setStartStopBtn('Start');
    }

    const timeSubject$ = new Subject();
    interval(10)
      .pipe(takeUntil(timeSubject$))
      .subscribe(() => {
        if (isTimerOn) {
          setTime((val) => val + 1);
        }
      });

    return () => {
      timeSubject$.next();
      timeSubject$.complete();
    };
  }, [isTimerOn]);

  return (
    <section className="App">
      <div className="App-header">
        <div className="timer__wrapper">
          <div>
            {Math.trunc(time / 6000)}
            :
            {Math.trunc(time / 100) % 60}
            :
            {time % 100}
          </div>
          <button
            type="button"
            onClick={handleClick}
            id="start-stop"
          >
            {startStopBtn}
          </button>
          <button
            type="button"
            onClick={handleWait}
            id="wait"
          >
            Wait
          </button>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </section>
  );
}

export default App;
