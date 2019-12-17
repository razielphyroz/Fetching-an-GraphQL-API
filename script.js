const continentSelect = document.getElementById('continent-select');
const countryList = document.getElementById('countries-list');

// Created to query the API (Code Reuse) -----------------------------------------

function queryFetch(query, variables) {
  return fetch('http://countries.trevorblades.com/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables
    })
  }).then(res => res.json())
}

// Creates the continent select options ------------------------------------------

queryFetch(`
  {
    continents {
      name,
      code
    }
  }
`).then(data => {
  data.data.continents.forEach(con => {
    const option = document.createElement('option');
    option.value = con.code;
    option.innerHTML = con.name;
    continentSelect.append(option);
  });
});

// Calls the API to receive the countries list -----------------------------------

function getContinentCountries(continentCode) {
    return queryFetch(`
      query getCountries($code: String) {
        continent(code: $code) {
          countries {
            name
          }
        }
      }
  `, { "code": continentCode }).then(data => data.data.continent.countries);
}

// Updates the countries list when selecting a continent -------------------------

continentSelect.addEventListener('change', async e => {
  const continentCode = e.target.value;
  const countries = await getContinentCountries(continentCode);
  countryList.innerHTML = '';
  countries.forEach(country => {
    const element = document.createElement('div');
    element.innerText = country.name;
    countryList.append(element);
  });
  
});