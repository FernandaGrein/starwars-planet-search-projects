import React from 'react';
import './App.css';
import Provider from './contex/Provider';
import Table from './components/Table';
import Form from './components/Forms';

function App() {
  return (
    <Provider>
      <Form />
      <Table />
    </Provider>
  );
}

export default App;
