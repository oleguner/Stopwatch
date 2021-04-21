import React, { useEffect, useState } from 'react';

import {
  interval, Subject, fromEvent,
} from 'rxjs';

import {
  takeUntil, map, buffer, debounceTime, filter,
} from 'rxjs/operators';

import './App.css';

function App() {
  const [time, setTime] = useState(0);
  const [isTimerOn, setTimerOn] = useState(false);
  const [startStopButtonText, setStartStopButtonText] = useState('');

  const handleStartStop = () => {
    setTimerOn(!isTimerOn);
  };

  const handleReset = () => {
    setTime(0);
    setTimerOn(true);
  };

  useEffect(() => {
    if (isTimerOn) {
      setStartStopButtonText('Stop');
    } else {
      setStartStopButtonText('Start');
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

  /* ======================= DOUBLE CLICK ========================= */

  useEffect(() => {
    const clicks$ = fromEvent(document.getElementById('wait'), 'click');
    const buff$ = clicks$.pipe(debounceTime(299));

    clicks$.pipe(
      buffer(buff$),
      map((list) => list.length),
      filter((length) => {
        if (length < 2) {
          console.log('it counts as 1 click');
        } else {
          console.log('that`s good');
        }

        return length === 2;
      }),
    ).subscribe(() => setTimerOn(false));

    return () => clicks$.unsubscribe();
  }, []);

  /* ================================================================ */

  return (
    <section className="App">
      <div className="timer">
        <div className="timer__wrapper">
          <div className="display-wrapper">

            <div className="timer__display">
              {Math.trunc(time / 6000) < 10
                && <span>0</span>}
              {Math.trunc(time / 6000)}
            </div>

            <div className="timer__display">
              :
            </div>

            <div className="timer__display">

              {Math.trunc(time / 100) % 60 < 10
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
              onClick={handleStartStop}
              id="start-stop"
            >
              {startStopButtonText}
            </button>
            <button
              className="wait"
              type="button"
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
