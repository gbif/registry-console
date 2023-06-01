// example geocode usage from osm https://nominatim.openstreetmap.org/search?street=Radnicka%2020a&city=Novi%20Sad&country=Serbia&format=json

// iterate over all institutions and add coordinates to the institution
// wait 10 second between each request to avoid rate limiting

const qs = require('qs');
const axios = require('axios');
const fs = require('fs');
const dir = __dirname;

const geocode = async (type) => {
  let institutions = JSON.parse(fs.readFileSync(`${dir}/${type}.json`));
  // only consider institutions without latitude and longitude
  institutions = institutions.filter((institution) => {
    return !institution.latitude && !institution.longitude;
  });

  const geocoded = [];

  for (const institution of institutions) {
    const address = institution.address;
    const city = address.city;
    const country = address.country;
    const street = address.address;
    const postalCode = address.postalCode;
    const params = {
      street,
      city,
      countrycodes: country,
      postalCode,
      format: 'json'      
    }

    const url = `https://nominatim.openstreetmap.org/search?${qs.stringify(params)}`;
    
    const response = await axios.get(url, {headers: {'User-Agent': 'GBIF.org'}});
    const data = response.data;
    console.log(url);
    if (data.length > 0) {
      console.log('found coordinates for ' + institution.key);
      const first = data[0];
      institution.geocoded_latitude = first.lat;
      institution.geocoded_longitude = first.lon;
      geocoded.push(institution);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 10000);
    });
  }

  fs.writeFileSync(`${dir}/${type}_geocoded.json`, JSON.stringify(geocoded, null, 2));
}

geocode('institutions');