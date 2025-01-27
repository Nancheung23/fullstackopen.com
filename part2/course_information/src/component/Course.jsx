// 2.5: separate module
import React from "react";
// 2.1: Course information step6
const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total exercises={course.parts} />
        </div>
    );
};


const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    );
};

const Part = (props) => {
    return (
        <p>
            {props.name} {props.exercises}
        </p>
    );
};

const Content = (props) => {
    console.log(props);
    return (
        props.parts.map(part => <Part key={props.parts.indexOf(part)} name={part.name} exercises={part.exercises} />)
    );
};

// 2.2: Course information step7
const Total = (props) => {
    return (
        <strong>total of {
            // exercises 1.3: reformat
            props.exercises.reduce((sum, e) => sum + e.exercises, 0)
        } exercises</strong>
    );
};

export default Course;