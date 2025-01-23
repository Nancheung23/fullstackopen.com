import { useState } from "react";

const Hello = (props) => {
  // component helper functions
  // const bornYear = () => {
  //   const yearNow = new Date().getFullYear();
  //   return yearNow - props.age;
  // };
  const bornYear = () => new Date().getFullYear() - age;

  // destructuring
  // const name = props.name;
  // const age = props.age;
  const { name, age } = props;

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were born in {bornYear()}</p>
    </div>
  );
};

// passing state to child
const Button = ({ name, handler }) => {
  return (
    <>
      <button onClick={handler}>
        {name}
      </button>
    </>
  );
};

const App = () => {
  // counter hook: every second add 1
  const [count, setCount] = useState(0);
  // setTimeout(() => {
  //   // setCount(count + 1);
  //   setCount(2);
  // }, 1000);

  // counter hook: clicks
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  });

  // extension: whole clicks
  const [allClicks, setAll] = useState([]);

  // handle click
  const handleAdd = () => {
    setCount(count + 1);
    console.log('+1');
  };

  // handle reset
  const handleReset = () => {
    setCount(0);
    console.log('reset');
  };

  // handle decrease
  const handleMinus = () => {
    if (count < 1) {
      console.log('Can\'t decrease because -1 is invalid');
      return;
    }
    setCount(count - 1);
    console.log('-1');
  };

  // complex state
  const handleClicks = (direction) => {
    switch (direction) {
      case 'Left':
        setClicks(
          {
            // spread syntax
            ...clicks,
            left: clicks.left + 1
          }
        );
        // push() not recommanded
        setAll(allClicks.concat('L'));
        break;
      case 'Right':
        setClicks(
          {
            // spread syntax
            ...clicks,
            right: clicks.right + 1
          }
        );
        // push() not recommanded
        setAll(allClicks.concat('R'));
        break;
      default:
        break;
    }
  };

  const name = 'Peter';
  const age = 10;

  // destructuring
  const des = {
    name: 'Arto Hellas',
    age: 35,
  };

  console.log('rendering...', count);
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />

      <div>
        {/* add counter */}
        <p>Count: {count}</p>
        {/* handle add function */}
        <Button name={'Increase'} handler={handleAdd} />
        &nbsp;
        {/* set back to zero */}
        <Button name={'Reset'} handler={handleReset} />
        &nbsp;
        {/* handle minus function */}
        <Button name={'Decrease'} handler={handleMinus} />
        &nbsp;
      </div>

      {/* complex state */}
      <div>
        <span>Left: {clicks.left}</span>
        &nbsp;
        <Button name={'Left'} handler={() => handleClicks('Left')} />
        &nbsp;
        <span>Right: {clicks.right}</span>
        &nbsp;
        <Button name={'Right'} handler={() => handleClicks('Right')} />
        &nbsp;
        <span>History: {allClicks.join(' ')}</span>
      </div>
    </div>
  );
};

export default App;