import React, { useState } from 'react';
import logo from './assets/logo.png';
import tumbleweedImg from './assets/tumbleweed.gif';
import './App.css';

import fetchFoodTrucks from './services/datasf';

function App() {
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchLimit, setSearchLimit] = useState(5);
  const [longitude, setLongitude] = useState(undefined);
  const [latitude, setLatitude] = useState(undefined);

  const defaultErrors = {
    fetch: false,
    limit: false,
    longitude: false,
    latitude: false,
  };

  const [searchErrors, setSearchErrors] = useState(defaultErrors);
  const MAX_MENU_ITEMS = 5;

  // TODO: Graphic for fetching

  const hasErred = () => {
    Object.entries(searchErrors).some(([source, status]) => source !== 'fetch' && status);
  };
  const hasQueries = () => searchLimit && longitude && latitude;

  const getFoodTrucks = () => {
    setNoResults(false);
    if(!hasErred() && hasQueries()) {
      return fetchFoodTrucks({ $limit: searchLimit, longitude, latitude })
        .then(foodTrucks => {
          setSearchErrors({ ...searchErrors, fetch: false });
          setFoodTrucks(foodTrucks);
          return foodTrucks.length === 0 && setNoResults(true);
        })
        .catch((error) => {
          console.warn('An error occurred fetching from DataSF', error);
          setSearchErrors({ ...searchErrors, fetch: true });
        });
    }
    setSearchErrors({ ...searchErrors, fetch: true });
  };

  const isInRange = ({ min=Number.MIN_SAFE_INTEGER, max=Number.MAX_SAFE_INTEGER }) => value => value >= min && value <= max;
  const handleMap = {
    limit: { updateState: setSearchLimit, isValidInput: isInRange({ min: 1}) },
    longitude: { updateState: setLongitude, isValidInput: isInRange({ min: -180, max: 80 }) },
    latitude: { updateState: setLatitude, isValidInput: isInRange({ min: -90, max: 90 }) },
  };
  const handleSearchChange = type => ({ target: { value } }) => handleMap[type].updateState(value);
  const handleSearchBlur = type => ({ target: { value } }) => setSearchErrors({
    ...searchErrors,
    [type]: !handleMap[type].isValidInput(Number.parseInt(value)),
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div>
        <input type="number" min="0" onChange={handleSearchChange('limit')} onBlur={handleSearchBlur('limit')} value={searchLimit} />
        {searchErrors.limit && <div>Invalid Limit. Must be a number greater than 0</div>}
        <input type="number" placeholder="longitude" onChange={handleSearchChange('longitude')} onBlur={handleSearchBlur('longitude')} value={longitude} />
        {searchErrors.longitude && <div>{'Invalid Longitude: -180 <= longitude <= 80'}</div>}
        <input type="number" placeholder="latitude" onChange={handleSearchChange('latitude')} onBlur={handleSearchBlur('latitude')} value={latitude} />
        {searchErrors.latitude && <div>{'Invalid Latitude: -90 <= latitude <= 90'}</div>}
        <button onClick={getFoodTrucks}>SEARCH</button>
        {searchErrors.fetch && <div>Unable to Search</div>}
      </div>
      {noResults &&
        <React.Fragment>
          <div>No Food Here</div>
          <img className="no-results" src={tumbleweedImg} alt="No Results" />
        </React.Fragment>
      }
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
