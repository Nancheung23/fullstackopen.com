// exercise 1.1: define components
const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  );
};

// exercise 1.2: parts
const Part = (props) => {
  return (
    <p>
      {/* exercises 1.3: reformat */}
      {props.name} {props.exercises}
    </p>
  );
};

const Content = (props) => {
  console.log(props);
  return (
    // <p>
    //   {props.part} {props.exercise}
    // </p>
    // exercise 1.2: parts
    // exercises 1.3: reformat
    props.parts.map(part => <Part key={props.parts.indexOf(part)} name={part.name} exercises={part.exercises} />)
  );
};

const Total = (props) => {
  return (
    <p>Number of exercises {
      // exercises 1.3: reformat
      props.exercises.reduce((sum, e) => sum + e.exercises, 0)
    }</p>
  );
};


const App = () => {
  // const course = 'Half Stack application development';
  // const part1 = 'Fundamentals of React';
  // const exercises1 = 10;
  // const part2 = 'Using props to pass data';
  // const exercises2 = 7;
  // const part3 = 'State of a component';
  // const exercises3 = 14;

  // exercises 1.3: reformat
  // exercises 1.5: single JS object
  // const course = 'Half Stack application development';
  // const part1 = {
  //   name: 'Fundamentals of React',
  //   exercises: 10
  // };
  // const part2 = {
  //   name: 'Using props to pass data',
  //   exercises: 7
  // };
  // const part3 = {
  //   name: 'State of a component',
  //   exercises: 14
  // };
  // exercises 1.4: array solution
  // const parts = [
  //   {
  //     name: 'Fundamentals of React',
  //     exercises: 10
  //   },
  //   {
  //     name: 'Using props to pass data',
  //     exercises: 7
  //   },
  //   {
  //     name: 'State of a component',
  //     exercises: 14
  //   }
  // ]
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      {/* exercises 1.5: single JS object */}
      {/* exercise 1.1: define components */}
      <Header course={course.name} />
      {/* exercise 1.2: parts */}
      {/* exercises 1.4: array solution */}

      <Content parts={course.parts} />
      <Total exercises={course.parts} />
    </div>
  );
};

export default App;
