import React from 'react';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Canadian Light source',
        description: 'The brightest light in Canada is here!',
        imageUrl: 'https://images.tourismsaskatchewan.com/sitecollectionimages/Lightsource3.jpg',
        address: '44 Innovation Blvd, Saskatoon, SK S7N 2V3, Canada',
        location: {
            lat: 52.13735095551732,
            lng: -106.63089267726545
        },
        creator: 'uid1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
        address: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'uid1'
    }
];

const Places = () => {
  return <h2>Places loaded!</h2>;
};

export default Places;
