// 2.6: The Phonebook Step1
import { useEffect, useState } from 'react';
import Filter from './component/Filter';
import PersonForm from './component/PersonForm';
import Persons from './component/Persons';
import nodeService from './services/nodeService';
import Notification from './component/Notification';

const App = () => {
  // 2.9*: The Phonebook Step4
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newfilter, setNewFilter] = useState('');
  const [notify, newNotify] = useState('');
  const [display, newDisplay] = useState(false);
  // 2.11: The Phonebook Step6
  useEffect(() => {
    // 2.16: Phonebook step8
    nodeService
      .getAll()
      .then(initialData => {
        setPersons(initialData);
      })
      .catch(err => console.log('Error:', err))
  }, [persons]);

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(
      event.target.value
    );
  };

  // 2.8: The Phonebook Step3
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(
      event.target.value
    );
  };

  // 2.9*: The Phonebook Step4
  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);
  };

  // release hook
  const stateRelease = () => {
    // release hook
    setNewName('');
    setNewNumber('');
  };

  const notifyRelease = () => {
    setTimeout(() => {
      newNotify('');
      newDisplay(false);
    }, 5000);
  };

  const showNotification = (message) => {
    newNotify(message);
    newDisplay(true);
    notifyRelease();
  };

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    };
    // 2.8: The Phonebook Step3
    if (newName === '' || newNumber === '') {
      alert('Missing area');
      return;
    };
    // 2.7: The Phonebook Step2
    persons.some(person => person.name === newName) ?
      (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`) ?
        // 2.18 *: Phonebook step10
        nodeService
          .update(
            persons.find(person => person.name === newName).id,
            newPerson)
          .then(
            res => {
              stateRelease();
              showNotification('Update successfully');
            }
          )
        :
        console.log('Canceled')
      ) :
      // 2.15: Phonebook step7
      nodeService
        .create(newPerson)
        .then(res => {
          setPersons(persons.concat(res));
          stateRelease();
          showNotification(`Create successfully id: ${newPerson.id}`);
        })
        .catch(err =>
          console.log(err)
        )
  };

  // 2.17: Phonebook step9
  const handleDelete = (id) => {
    // console.log(`delete id: ${id}`);
    nodeService
      .getById(id)
      .then(res => {
        console.log(res);
        window.confirm(`Delete ${res.name} ?`) ?
          nodeService
            .remove(id)
            .then(
              res => {
                showNotification(`Delete successfully`);
              }
            ) : console.log('Canceled');
      })
      .catch(
        err => showNotification(`Information of ${id} has already been removed from server`)
      )
  };

  return (
    // 2.10: The Phonebook Step5
    <div>
      <h2>Phonebook</h2>
      <Notification message={notify} activated={display} />
      <Filter handler={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        name={newName}
        number={newNumber}
        nameHandler={handleNameChange}
        numberHandler={handleNumberChange}
        submit={addPerson}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={newfilter} handleDelete={handleDelete} />
    </div>
  );
};

export default App;