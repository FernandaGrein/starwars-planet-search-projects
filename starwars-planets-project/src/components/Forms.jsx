import React, { useContext, useState } from 'react';
import PlanetContex from '../contex/PlanetContex';
import '../App.css';

function Form() {
  const { filterByName, setFilterByName, filterByNumericValues,
    setFilterByNumericValues, handleDeleteFilter,
    setFilteredPlanets, data } = useContext(PlanetContex);

  const { name } = filterByName;

  const [columInput, setColumInput] = useState('population');
  const [comparisonInput, setComparisonInput] = useState('maior que');
  const [valueInput, setValueInput] = useState('0');

  const [columnOptions, setColOptions] = useState(['population',
    'orbital_period', 'diameter', 'rotation_period', 'surface_water']);

  const handleChange = ({ target }) => {
    setFilterByName({
      name: target.value,
    });
  };
  const filterTable = async (event) => {
    event.preventDefault();

    await setFilterByNumericValues(
      [...filterByNumericValues,
        {
          column: columInput,
          comparison: comparisonInput,
          value: valueInput,
        },
      ],
    );

    setColumInput('population');
    setComparisonInput('maior que');
    setValueInput('0');
    setColOptions(columnOptions.filter((item) => (item !== columInput)));
  };

  const deleteAllFilters = () => {
    setFilteredPlanets(data);
    setFilterByNumericValues([]);
    setColOptions(['population',
      'orbital_period', 'diameter', 'rotation_period', 'surface_water']);
  };

  const deleteFilter = async ({ target }) => {
    handleDeleteFilter(target.name);

    await setFilterByNumericValues(filterByNumericValues
      .filter((item) => (item.column !== target.name)));
  };

  return (
    <>
      <form className="formComponent">
        <label htmlFor="name">
          <input
            data-testid="name-filter"
            type="text"
            id="name"
            onChange={ handleChange }
            value={ name }
            name="name"
          />
        </label>
        <label htmlFor="column">
          <select
            data-testid="column-filter"
            id="column"
            onChange={ (event) => (setColumInput(event.target.value)) }
            value={ columInput }
            name="column"
          >
            { columnOptions.map((item, idx) => (
              <option
                key={ idx }
                value={ item }
              >
                {item}

              </option>)) }
          </select>
        </label>
        <label htmlFor="comparison">
          <select
            data-testid="comparison-filter"
            name="comparison"
            value={ comparisonInput }
            id="comparison"
            onChange={ (event) => (setComparisonInput(event.target.value)) }
          >
            <option value="maior que">maior que</option>
            <option value="menor que">menor que</option>
            <option value="igual a">igual a</option>
          </select>
        </label>
        <label htmlFor="value">
          <input
            type="number"
            data-testid="value-filter"
            value={ valueInput }
            id="value"
            name="value"
            onChange={ (event) => (setValueInput(event.target.value)) }
          />
        </label>
        <button
          data-testid="button-filter"
          type="submit"
          onClick={ filterTable }
        >
          Filtrar

        </button>
        <button
          data-testid="button-remove-filters"
          type="button"
          onClick={ deleteAllFilters }
        >
          Remover todas filtragens

        </button>
      </form>
      <section>
        {filterByNumericValues.map((item, index) => (
          <div key={ index } data-testid="filter">
            {item.column}
            {' '}
            |
            {' '}
            {item.comparison}
            {' '}
            |
            {' '}
            {item.value}
            {' '}
            <button
              type="button"
              onClick={ deleteFilter }
              name={ item.column }
            >
              X

            </button>
          </div>
        ))}
      </section>
    </>
  );
}

export default Form;
