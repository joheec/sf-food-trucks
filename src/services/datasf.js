require('dotenv').config();

// Endpoint for SF food truck database
// API Documentation: https://dev.socrata.com/foundry/data.sfgov.org/rqzj-sfat
const URL = 'https://data.sfgov.org/resource/rqzj-sfat.json';

/**
 * Returns headers for fetch, including token if available
 * @returns {Object}
 */
export const getHeaders = () => ({
  ...(process.env.DATASF_TOKEN && { 'X-App-Token': process.env.DATASF_TOKEN }),
});

/**
 * Returns fetch URL populated with query params
 * @param queries {Object} Query params
 * @returns {String} URL with query params
 */
export const formatQuery = queries => {
  const params = Object.keys(queries);
  const decoded = params.reduce((agg, param, index) => (
    index === 0
     ? `${agg + param}=${queries[param]}`
     : `${agg}&${param}=${queries[param]}`
  ), `${URL}?`);
  return encodeURI(decoded);
};

/**
 * Fetches food trucks from SF database
 * @param queries {Object} Query params
 * @returns {Promise} Body of response
 */
export default function fetchFoodTrucks(queries) {
  const urlQuery = formatQuery(queries);
  return fetch(urlQuery, { headers: getHeaders() })
    .then(res => res.json())
}
