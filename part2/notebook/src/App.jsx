import { useState, useEffect } from 'react';
import Note from "./component/Note";
import Notification from "./component/Notification";
import noteService from "./services/note";
import Footer from './component/Footer';

const App = () => {
  // const result = notes.map(note => note.id);
  // console.log(result);
  // controlled component
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  // Filtering Displayed Elements
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('some error happened...');
  // Effect-hooks
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes);
      });
  }, []);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote));
        setNewNote('');
      });
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const handleImportanceChange = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      }).catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        );
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNotes(notes.filter(n => n.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {/* <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li> */}
        {
          notesToShow.map(note =>
            <Note key={note.id} note={note} toggleImportance={() => handleImportanceChange(note.id)} />
          )
        }
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;