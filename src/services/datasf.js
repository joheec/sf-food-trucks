require('dotenv').config();

const URL = 'https://data.sfgov.org/resource/rqzj-sfat.json';

export const getHeaders = () => ({
  ...(process.env.DATASF_TOKEN && { 'X-App-Token': process.env.DATASF_TOKEN }),
});

// API Documentation: https://dev.socrata.com/foundry/data.sfgov.org/rqzj-sfat
export const formatQuery = queries => {
  const params = Object.keys(queries);
  const decoded = params.reduce((agg, param, index) => (
    index === 0
     ? `${agg + param}=${queries[param]}`
     : `${agg}&${param}=${queries[param]}`
  ), `${URL}?`);
  return encodeURI(decoded);
};

export default function fetchFoodTrucks(queries) {
  const urlQuery = formatQuery(queries);
  return fetch(urlQuery, { headers: getHeaders() })
    .then(res => res.json())
}
