const App = () => {
  const [breakTime, setBreakTime] = React.useState(15 * 60);
  const [sessionTime, setSessionTime] = React.useState(120 * 60);
  const [timeLeft, setTimeLeft] = React.useState(sessionTime);
  const [breakLeft, setBreakLeft] = React.useState(breakTime);
  const [isRunning, setIsRunning] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const intervalRef = React.useRef(null);

  const formatTime = (time) => {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;
    return (
      (hours < 10 ? '0' + hours : hours) +
      ':' +
      (minutes < 10 ? '0' + minutes : minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : seconds)
    );
  };

  const handleTime = (type, timeType) => {
    if (timeType === 'break') {
      if (type === 'increment') {
        setBreakTime((prevBreakTime) => prevBreakTime + 300);
        if(!isRunning)
          setBreakLeft((prevBreakTime) => prevBreakTime + 300);
      } else if(breakTime > 0) {
        setBreakTime((prevBreakTime) => prevBreakTime - 300);
        if(!isRunning)
          setBreakLeft((prevBreakTime) => prevBreakTime - 300);
      }
    } else if (timeType === 'session') {
      if (type === 'increment') {
        setSessionTime((prevSessionTime) => prevSessionTime + 300);
        if(!isRunning)
          setTimeLeft((prevSessionTime) => prevSessionTime + 300);
      } else if(sessionTime > 0) {
        setSessionTime((prevSessionTime) => prevSessionTime - 300);
        if(!isRunning)
          setTimeLeft((prevSessionTime) => prevSessionTime - 300);
      }
    }
  };

  const handleStart = () => {
    setOnBreak(false);
    if (!isRunning) {
      setIsRunning(true);
      let second = 1000;
      let date = new Date().getTime();
      let nextDate = new Date().getTime() + second;

      intervalRef.current = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          nextDate += second;
          setTimeLeft((prev) => {
            if (prev === 0) {
              clearInterval(intervalRef.current);
              handleBreak();
              return prev;
            }
            return prev - 1;
          });
        }
      }, 30);
    }
    if(isRunning && !onBreak)
      handleStop();
  };

  const handleBreak = () => {
      setOnBreak(true);
      let second = 1000;
      let date = new Date().getTime();
      let nextDate = new Date().getTime() + second;

      intervalRef.current = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          nextDate += second;
          setBreakLeft((prev) => {
            if (prev === 0) {
              handleStop();
              handleReset();
              return prev;
            }
            return prev - 1;
          });
        }
      }, 30);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    setBreakTime(15 * 60);
    setSessionTime(120 * 60);
    setTimeLeft(120 * 60);
  };

  return (
    <div className="container">
      <h2>{!isRunning ? "2h + 15m Focus Clock" : timeLeft === 0 || onBreak === true ? "Break" : "Focus"}</h2>
      <div className="clock" >
        <div className="settings-break">
          <h3 id="break-label">Break</h3>
          <div className="time-display-settings">
            <i onClick={() => handleTime('decrement', 'break')} className="fa-solid fa-minus" id="break-decrement"></i>
            <div className="time-display">{formatTime(breakTime)}</div>
            <i onClick={() => handleTime('increment', 'break')} className="fa-solid fa-plus" id="break-increment"></i>
          </div>
        </div>
        <div className="clock-time" onClick={handleStart}>
          {formatTime(timeLeft === 0 ? breakLeft : timeLeft)}
        </div>
        <div className="settings-session">
          <h3 id="session-label">Session</h3>
          <div className="time-display-settings">
            <i onClick={() => handleTime('decrement', 'session')} className="fa-solid fa-minus" id="session-decrement"></i>
            <div className="time-display">{formatTime(sessionTime)}</div>
            <i onClick={() => handleTime('increment', 'session')} className="fa-solid fa-plus" id="session-increment"></i>
          </div>
        </div>
        <i class="fa-solid fa-rotate-right" onClick={handleReset}></i>
      </div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
