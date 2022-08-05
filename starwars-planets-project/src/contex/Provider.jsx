import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PlanetContex from './PlanetContex';

const INICIAL_STATE = [];

function Provider({ children }) {
  const [data, setstate] = useState(INICIAL_STATE);
  const [filterByName, setFilterByName] = useState({ name: '' });
  const [filteredPlanets, setFilteredPlanets] = useState(data);
  const [filterByNumericValues,
    setFilterByNumericValues] = useState([]);

  useEffect(() => {
    const fetchPlanets = async () => {
      const fetchApi = await fetch('https://swapi-trybe.herokuapp.com/api/planets/');
      const result = await fetchApi.json();
      const completeResult = result.results;
      completeResult.forEach((item) => delete item.residents);
      setstate(completeResult);
    };

    fetchPlanets();
  }, []);

  useEffect(() => {
    const filterResult = data.filter((itens) => (itens.name
      .includes(filterByName.name)));
    setFilteredPlanets(filterResult);
  }, [data, filterByName]);

  useEffect(() => {
    const filterPlantesByNumericFilters = () => {
      const handleFilterOptions = (planet, matcher) => {
        const { column, comparison, value } = matcher;
        if (comparison === 'maior que') {
          return Number(planet[column]) > Number(value);
        }
        if (comparison === 'menor que') {
          return Number(planet[column]) < Number(value);
        }
        if (comparison === 'igual a') {
          return Number(planet[column]) === Number(value);
        }
      };

      filterByNumericValues.forEach((elem) => (setFilteredPlanets(filteredPlanets
        .filter((item) => handleFilterOptions(item, elem)))));
    };
    filterPlantesByNumericFilters();
  }, [filterByNumericValues]);

  const handleDeleteFilter = (targetName) => {
    const handleDelete = (planet, filter) => {
      const { column, comparison, value } = filter;
      if (comparison === 'maior que') {
        return Number(planet[column]) > Number(value);
      }
      if (comparison === 'menor que') {
        console.log('menor que');
        return Number(planet[column]) < Number(value);
      }
      if (comparison === 'igual a') {
        return Number(planet[column]) === Number(value);
      }
    };

    const toFilter = [...data];
    if (filterByNumericValues.length > 1) {
      filterByNumericValues.filter((obj) => (obj.column !== targetName))
        .forEach((elem) => (setFilteredPlanets(toFilter
          .filter((item) => handleDelete(item, elem)))));
    }

    if (filterByNumericValues.length <= 1) {
      setFilteredPlanets(data);
    }
  };

  const contex = {
    data,
    filterByName,
    setFilterByName,
    filteredPlanets,
    filterByNumericValues,
    setFilterByNumericValues,
    setFilteredPlanets,
    handleDeleteFilter,

  };

  return (
    <PlanetContex.Provider value={ contex }>
      { children }
    </PlanetContex.Provider>
  );
}

export default Provider;

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};
