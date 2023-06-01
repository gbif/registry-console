// fetch all institutions and collections and write them to a file
// for use in the extractCoordinates script
const axios = require('axios');
const fs = require('fs');
const _ = require('lodash');
const dir = __dirname;

const getInstitutions = async (rest) => {
  return getData({ type: 'institution', ...rest });
}

const getCollections = async (rest) => {
  return getData({ type: 'collection', ...rest });
}

const getData = async ({ type, limit: size, offset: from } = {}) => {
  const limit = Number.parseInt(size) || 300;
  let offset = Number.parseInt(from) || 0;
  let institutions = [];
  let total = 0;

  do {
    const response = await axios.get('https://api.gbif.org/v1/grscicoll/' + type, {
      params: {
        limit,
        offset,
      }
    });

    // prune response to only include a subset of the fields, to reduce the size of the response
    // the fields are latitude, longitude, code, name, key, active, numberSpecimens
    response.data.results = response.data.results.map((institution) => {
      return {
        address: institution.address,
        latitude: institution.latitude,
        longitude: institution.longitude,
        key: institution.key
      }
    });

    // filter on institutions that have an address field
    response.data.results = response.data.results.filter((institution) => {
      return institution.address && institution.address.address && institution.address.city && institution.address.country;
    });

    institutions = institutions.concat(response.data.results);
    total = response.data.count;
    offset += limit;
  } while (offset < total && !size);

  return institutions;
}

// get institutions and save them to disk
const saveInstitutions = async () => {
  const institutions = await getInstitutions();
  fs.writeFileSync(`${dir}/institutions.json`, JSON.stringify(institutions, null, 2));
}

const saveCollections = async () => {
  const collections = await getCollections();
  fs.writeFileSync(`${dir}/collections.json`, JSON.stringify(collections, null, 2));
}

saveInstitutions();