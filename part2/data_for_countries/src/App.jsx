// 2.12 * Data for countries, step1

import { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './component/Filter';
import Display from './component/Display';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState('');
  const [selected, setNewSelected] = useState([]);

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(res => {
        console.log(res.data);
        setCountries(res.data);
        setNewSelected(res.data);
      })
  }, []);

  const handleFilterChange = (event) => {
    console.log('Input:', event.target.value);
    setNewFilter(event.target.value);
    setNewSelected(countries.filter(
      country => country.name.common.toLowerCase().includes(newFilter.toLowerCase())
    ));
  };

  // 2.13 *: Data for countries, step2
  const handleClick = (area) => {
    setNewSelected(countries.filter(country => country.area === area));
  }

  return (
    <>
      <Filter handler={handleFilterChange} />
      {/* 2.13*: Data for countries, step2 */}
      <Display countries={selected} clickHandler={handleClick} />
    </>
  )
}

export default App;