// example 2: Multi components
// const Hello = () => {
//   return (
//     <div>
//       <p>Hello World</p>
//     </div>
//   );
// };

// example 3: prop
// const Hello = (props) => {
//   return (
//     <div>
//       <p>Hello {props.name}!</p>
//     </div>
//   );
// };

// example 4: props
const Hello = (props) => {
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  );
};

// example 5: root
const Footer = () => {
  return (
    <div>
      Examples are created by&nbsp;
      <a href="https://github.com/Nancheung23">
        Nancheung23
      </a>
    </div>
  );
};

const App = () => {
  // hello world
  // console.log('Hello from component');
  // return (
  //   <div>
  //     <p>Hello World!</p>
  //   </div>
  // );

  // example 1: var
  // const now = new Date();
  // const a = 10;
  // const b = 20;
  // return (
  //   <div>
  //     <p>Hello world, it is {now.toString()}</p>
  //     <p>
  //       {/* <br> in JSX needs to be <br/> */}
  //       {a} + {b} = {a + b} <br />
  //       {a} - {b} = {a - b} <br />
  //       {a} x {b} = {a * b} <br />
  //       {a} / {b} = {a / b}
  //     </p>
  //   </div>
  // );

  // example 2: Multi components
  // return (
  //   <div>
  //     <h1>Greetings</h1>
  //     <Hello />
  //     <Hello />
  //     <Hello />
  //   </div>
  // );

  // example 3: prop
  // return (
  //   <div>
  //     <h1>Greetings</h1>
  //     <Hello name="George" />
  //     <Hello name="Daisy" />
  //   </div>
  // );

  // example 4: props
  // const name = 'Peter';
  // const age = 10;
  // return (
  //   <div>
  //     <h1>Greetings</h1>
  //     <Hello name="Maya" age={26 + 10} />
  //     <Hello name={name} age={age} />
  //   </div>
  // );

  // example 5: root
  return (
    <div>
      <h1>Greetings</h1>
      <Hello name={"Nan"} age={28} />
      <Footer />
    </div>
  );
};

export default App;
