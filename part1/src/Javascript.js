// Variables
// const x = 1
// let y = 5

// console.log(x, y)
// y += 10
// console.log(x, y)
// y = 'sometext'
// console.log(x, y)
// x = 4

// Arrays
// const t = [1, -1, 3]

// t.push(5)

// console.log(t.length)
// console.log(t[1])

// t.forEach(value => {
//     console.log(value)
// })
// const t = [1, 2, 3, 4, 5];
// // ES6
// const [first, second, ...rest] = t;
// console.log(first, second);
// console.log(rest);

// Object
const object1 = {
    name: 'Arto Hellas',
    age: 35,
    education: 'PhD',
}

const object2 = {
    name: 'Full Stack web application development',
    level: 'intermediate studies',
    size: 5,
}

const object3 = {
    name: {
        first: 'Dan',
        last: 'Abramov',
    },
    grades: [2, 3, 5, 3],
    department: 'Stanford University',
}

console.log(object1.name)
const fieldName = 'age'
console.log(object1[fieldName])

// Functions
const average = function (a, b) {
    return (a + b) / 2
}

const result = average(2, 5)
// result is now 3.5

console.log(result);

// Object methods and "this"
const arto = {
    name: 'Arto Hellas',
    greet: function () {
        console.log('hello, my name is ' + this.name)
    },
}

// setTimeout(arto.greet, 1000)
// using bind to lock current status of "this"
setTimeout(arto.greet.bind(arto), 1000)