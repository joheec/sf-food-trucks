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
      </header>
      <div className="stores">
        {foodTrucks.map(truck => (
          <div key={truck.objectid} className="food-truck">
            <div className="name">{truck.applicant}</div>
            <div className="address">{truck.address}</div>
            <ul className="menu-items">
              {truck.fooditems.split(': ')
                .slice(0, MAX_MENU_ITEMS)
                .map(menuItem => (
                  <li key={menuItem}>{menuItem.slice(0, 1).toUpperCase() + menuItem.slice(1)}</li>
                ))
              }
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
