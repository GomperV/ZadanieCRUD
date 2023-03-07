import logo from './logo.svg';
import './App.css';

import Published from './published';
import React, { Component } from 'react';

class App extends Component {
  state = {
    zadania: [],
    isLoading: true
  };

  async componentDidMount() {
    const response = await fetch('http://localhost:8091/api/baza/published');
    const body = await response.json();
    this.setState({zadania: body, isLoading: false});
  }

  async remove(id) {
    try {
      console.log("ID: " + id);
        await fetch(`http://localhost:8091/api/baza/published/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        let updatedZadania = [...this.state.zadania].filter(i => i.id !== id);
        this.setState({zadania: updatedZadania});
    } catch (error) {
        console.error(error);
    }
  }

  render() {
    const {zadania, isLoading} = this.state;

    if (isLoading) {
        return <p>Loading...</p>;
    }

    const zadaniaList = zadania.map(zadanie => {
        return <div key={zadanie.id}>
            {zadanie.title} ({zadanie.description})
            <button onClick={() => this.remove(zadanie.id)}>Delete</button>
        </div>
    });

    return (
        <div className="App">
          <header className="App-header">
            <div className="App-intro">
              <h2>Books</h2>
              {zadaniaList}
            </div>
          </header>
        </div>
    );
  }
}

export default App;