import { hi } from 'date-fns/locale';
import { useState } from 'react';

// 1.12*: anecdotes step1
const Button = ({ text, handler }) => {
  return (
    <>
      <button onClick={handler}>
        {text}
      </button>
    </>
  );
};

// 1.13 *: anecdotes step2
const Display = ({ text, value }) => {
  return (
    <>
      <p>
        has {value} {text}s
      </p>
    </>
  );
};

// 1.14*: anecdotes step3
const Header = ({ text }) => {
  return (
    <h1>
      {text}
    </h1>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ];

  const [selected, setSelected] = useState(0);
  // 1.13 *: anecdotes step2
  const [vote, setVote] = useState(Array(anecdotes.length).fill(0));
  // 1.12*: anecdotes step1
  const handleClick = () => {
    setSelected(
      Math.floor(Math.random() * anecdotes.length)
    );
  };

  // 1.13 *: anecdotes step2
  const handleVote = () => {
    // const copy = [...vote];
    // copy[selected] += 1;
    // setVote(
    //   copy
    // );
    console.log('Current vote: ', vote);

    setVote(
      vote.with(selected, vote.at(selected) + 1)
    );

  }

  return (
    <div>
      {/* 1.14*: anecdotes step3 */}
      <Header text={'Anecdote of the day'} />
      {anecdotes[selected]}
      {/* 1.12*: anecdotes step1 */}
      <div>
        {/* 1.13*: anecdotes step2 */}
        <Display text={'vote'} value={vote.at(selected)} />
        <Button text={'vote'} handler={handleVote} />
        &nbsp;
        <Button text={'next anecdote'} handler={handleClick} />
      </div>
      {/* 1.14*: anecdotes step3 */}
      <Header text={'Anecdote with most votes'} />
      <div>
        {anecdotes.at(vote.findIndex(v => v === vote.toSorted((a, b) => a - b).pop()))}
        <Display text={'vote'} value={vote.toSorted((a, b) => a - b).pop()} />
      </div>
    </div>
  );
};

export default App;