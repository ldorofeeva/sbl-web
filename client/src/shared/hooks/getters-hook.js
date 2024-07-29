import {useEffect, useState} from 'react';
import {useHttpClient} from "./http-hook";

export const useGetter = () => {

    const {sendRequest} = useHttpClient();
    const [malts, setMalts] = useState([])
    const [hops, setHops] = useState([])
    const [beers, setBeers] = useState([])

    const beerSchema = {
        type: 'object',
        additionalProperties: {
            "type": "string"
        },
        properties: {
            name: {
                type: 'string',
                title: 'Name'
            },
            hops: {
                type: 'array',
                title: 'Hops',
                uniqueItems: true,
                items: {
                    enum: hops
                }
            },
            base_malt: {
                type: 'string',
                title: 'Base Malt',
                enum: malts
            },
            malts: {
                type: 'array',
                title: 'Other Malts',
                uniqueItems: true,
                items: {
                    enum: malts
                }
            },
        },
    }

    const batchSchema = {
        type: 'object',
        additionalProperties: {
            "type": "string"
        },
        properties: {
            beerName: {
                type: 'string',
                title: 'Beer',
                enum: beers
            },
            size: {
                type: 'number',
                title: 'Batch size (liters)'
            },
            date: {
                type: 'string',
                format: 'date',
                title: 'Date'
            }
        }
    }

    useEffect(() => {
        const getMalts = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/malts/`,
                    "GET",
                    null,
                );
                console.log(responseData);

                setMalts(responseData.map(result => result.name))

            } catch (err) {
                console.log(err);
            }
        };
        const getHops = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/hops/`,
                    "GET",
                    null,
                );

                setHops(responseData.map(result => result.name))

            } catch (err) {
                console.log(err);
            }
        };
        const getBeers = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/beers/`,
                    "GET",
                    null,
                );

                setBeers(responseData.map(result => result.name))

            } catch (err) {
                console.log(err);
            }
        };
        getMalts();
        getHops();
        getBeers();
    }, [sendRequest, setMalts, setHops, setBeers]);

    return {hops, malts, beers, beerSchema, batchSchema}
}