import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import './App.css';

import fetchFoodTrucks from './services/datasf';

function App() {
  const [foodTrucks, setFoodTrucks] = useState([]);
  useEffect( () => {
    const fetchData = async () => {
      const foodTrucks = await fetchFoodTrucks();
      setFoodTrucks(foodTrucks);
      console.log({ foodTrucks });
    }
    fetchData();
  }, []);
  // TODO: Inputs for limit (default = 5), longitude, latitude
  // TODO: Inputs need to be numbers
  // TODO: Graphic for fetching
  // TODO: Graphic for error in fetching
  const MAX_MENU_ITEMS = 5;
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        { foodTrucks.map(truck => (
          <div key={truck.objectid}>
            <div>{truck.applicant}</div>
            <div>{truck.address}</div>
            <a
              className="App-link"
              href={truck.schedule}
              target="_blank"
              rel="noopener noreferrer"
            >SCHEDULE</a>
            <ul className="menu-items">
              {truck.fooditems.split(': ')
                .slice(0, MAX_MENU_ITEMS)
                .map(menuItem => (
                  <li key={menuItem}>{menuItem.slice(0, 1).toUpperCase() + menuItem.slice(1)}</li>
                ))
              }
            </ul>
          </div>
        )) }
      </header>
    </div>
  );
}

export default App;
