import { useState } from 'react';
import { useEffect } from 'react';

// 1.6: unicafe step1
const Header = ({ title }) => {
  return (
    <>
      <h1>{title}</h1>
    </>
  );
};

// 1.10: unicafe step5
const Button = ({ name, handler }) => {
  return (
    <>
      <button onClick={handler}>
        {name}
      </button>
    </>
  );
};

// 1.10: unicafe step5
const StatisticLine = ({ text, value }) => {
  /* 1.11*: unicafe step6 */
  return (
    <tr>
      <th>{text}</th>
      <td>{value}</td>
    </tr>
  );
};

// 1.8: unicafe step3
const Statistics = (props) => {
  const { good, neutral, bad, all, avg, pos } = props;
  // 1.9: unicafe step4
  return (
    (good === 0 && neutral === 0 && bad === 0 && all === 0) ?
      <>
        <p>No feedback given</p>
      </>
      :
      <>
        <Header title={'statistics'} />
        <table>
          {/* 1.11*: unicafe step6 */}
          <tbody>
            {/* statistics */}
            <StatisticLine text={'good'} value={good} />
            <StatisticLine text={'neutral'} value={neutral} />
            <StatisticLine text={'bad'} value={bad} />
            {/* 1.6's handler */}
            <StatisticLine text={'all'} value={all} />
            <StatisticLine text={'average'} value={avg} />
            <StatisticLine text={'positive'} value={pos.toString().concat(' ', '%')} />
          </tbody>
        </table>
      </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // 1.7: unicafe step2
  const [all, setAll] = useState(0);
  const [avg, setAvg] = useState(0);
  const [pos, setPos] = useState(0);
  useEffect(() => {
    setAll(good + neutral + bad);
    setAvg((good - bad) / (good + neutral + bad || 1));
    setPos((good / (good + neutral + bad || 1)) * 100);
  }, [good, neutral, bad]);


  // 1.6's handler
  const handleFeedback = (feedback) => () => {
    switch (feedback) {
      case 'good':
        setGood(good + 1);
        break;
      case 'neutral':
        setNeutral(neutral + 1);
        break;
      case 'bad':
        setBad(bad + 1);
        break;
      default:
        console.log('Error input: ', feedback);
        break;
    };
  };

  return (
    <div>
      <Header title={'give feedback'} />
      {/* buttons */}
      <div>
        <Button name={'good'} handler={handleFeedback('good')} />
        &nbsp;
        <Button name={'neutral'} handler={handleFeedback('neutral')} />
        &nbsp;
        <Button name={'bad'} handler={handleFeedback('bad')} />
      </div>
      {/* 1.8: unicafe step3 */}
      <Statistics
        good={good} neutral={neutral} bad={bad}
        all={all} avg={avg} pos={pos}
      />
    </div>
  );
};

export default App;
