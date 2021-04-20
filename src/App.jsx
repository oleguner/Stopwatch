import React, { useEffect, useState } from 'react';
import {
  interval,
  Subject,
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
      <div className="timer">
        <div className="timer__wrapper">
          <div className="display-wrapper">

            <div className="timer__display">
              {(time / 6000) < 10
                && <span>0</span>}
              {Math.trunc(time / 6000)}
            </div>

            <div className="timer__display">
              :
            </div>

            <div className="timer__display">

              {(time / 100) < 10
                && <span>0</span>}
              {Math.trunc(time / 100) % 60}
            </div>

            <div className="timer__display">
              :
            </div>

            <div className="timer__display">
              {(time % 100) < 10
                && <span>0</span>}
              {time % 100}
            </div>

          </div>
          <div className="button-wrapper">
            <button
              className={isTimerOn ? 'stop' : ''}
              type="button"
              onClick={handleClick}
              id="start-stop"
            >
              {startStopBtn}
            </button>
            <button
              className="wait"
              type="button"
              onClick={handleWait}
              id="wait"
            >
              Wait
            </button>
            <button
              className="reset"
              type="button"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default App;
