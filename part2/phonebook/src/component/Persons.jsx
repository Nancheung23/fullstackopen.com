// 2.10: The Phonebook Step5
import React from "react";

const Persons = ({ persons, filter, handleDelete }) => {
    // 2.6: The Phonebook Step1
    return (
        <div>
            {
                // 2.9 *: The Phonebook Step4
                persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person =>
                    <p key={person.id}>{person.name} {person.number}
                        &nbsp;<button onClick={() => handleDelete(person.id)}>delete</button>
                    </p>
                )
            }
        </div>
    );
};

export default Persons;