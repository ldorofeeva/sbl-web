import {useEffect, useState} from 'react';
import {useHttpClient} from "./http-hook";

export const useGetter = () => {

    const {sendRequest} = useHttpClient();
    const [malts, setMalts] = useState([])
    const [hops, setHops] = useState([])
    const [beers, setBeers] = useState([])
    const salts = ["CaSO4", "CaCl", "NaCl", "CaCO3", "H3PO4"]
    const units = ["Kg", "g", "L"]
    const fermentors = [1, 2, 3]
    const bright_tanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const stages = ["Mash-In", "Mash-Out", "Sparge Start", "Sparge End", "Boil Start", "Boil End"]

    const beerSchema = {
        type: 'object',
        additionalProperties: {
            'type': 'string'
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
        definitions: {
            stage_stats: {
                type: 'object',
                properties: {
                    stage: {
                        type: 'string',
                        title: 'Stage',
                        enum: stages
                    },
                    time: {
                        type: 'string',
                        title: 'Time',
                        format: 'date-time'
                    },
                    volume: {
                        type: 'number',
                        title: 'Water Volume'
                    },
                    units: {
                        type: 'string',
                        title: 'Units',
                        enum: units,
                        default: "L"
                    },
                    temp: {
                        type: 'string',
                        title: 'Temperature'
                    },
                    sg: {
                        type: 'string',
                        title: 'S.G.'
                    },
                    ph: {
                        type: 'string',
                        title: 'pH'
                    }
                }
            },
            fermentor_stats: {
                type: 'object',
                properties: {
                    fermentor: {
                        type: 'number',
                        title: 'Fermentor',
                        enum: fermentors
                    },
                    sg: {
                        type: 'string',
                        title: 'S.G.'
                    },
                    alcohol: {
                        type: 'string',
                        title: 'Alcohol'
                    },
                    temp: {
                        type: 'string',
                        title: 'Temperature'
                    },

                    ph: {
                        type: 'string',
                        title: 'pH'
                    },
                    volume: {
                        type: 'number',
                        title: 'Water Volume'
                    },
                    units: {
                        type: 'string',
                        title: 'Units',
                        enum: units,
                        default: "L"
                    },
                    date: {
                        type: 'string',
                        title: 'Date',
                        format: 'date'
                    }
                }
            },
            bright_tank_stats: {
                type: 'object',
                properties: {
                    bright_tank: {
                        type: 'number',
                        title: 'Bright Tank',
                        enum: bright_tanks
                    },
                    sg: {
                        type: 'string',
                        title: 'S.G.'
                    },
                    alcohol: {
                        type: 'string',
                        title: 'Alcohol'
                    },
                    temp: {
                        type: 'string',
                        title: 'Temperature'
                    },

                    ph: {
                        type: 'string',
                        title: 'pH'
                    },
                    volume: {
                        type: 'number',
                        title: 'Water Volume'
                    },
                    units: {
                        type: 'string',
                        title: 'Units',
                        enum: units,
                        default: "L"
                    },
                    date: {
                        type: 'string',
                        title: 'Date',
                        format: 'date'
                    }
                }
            }
        },
        type: 'object',
        required: [
            'size',
            'date'
        ],
        additionalProperties: {
            'type': 'string'
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
            },
            fermentables: {
                type: 'array',
                title: 'Fermentables',
                items: {
                    type: 'object',
                    required: [
                        'malt',
                        'number',
                        'unit'
                    ],
                    properties: {
                        malt: {
                            type: 'string',
                            title: 'Malt',
                            enum: malts
                        },
                        number: {
                            type: 'number',
                            title: 'Size',
                        },
                        unit: {
                            type: 'string',
                            title: 'Units',
                            enum: units
                        }
                    }
                }
            },
            salts: {
                type: 'array',
                title: 'Salts',
                items: {
                    type: 'object',
                    required: [
                        'salt',
                        'number',
                        'unit'
                    ],
                    properties: {
                        salt: {
                            type: 'string',
                            title: 'Salt',
                            enum: salts
                        },
                        number: {
                            type: 'number',
                            title: 'Size',
                        },
                        unit: {
                            type: 'string',
                            title: 'Units',
                            enum: units
                        }
                    }
                }
            },
            hops: {
                type: 'array',
                title: 'Hops',
                items: {
                    type: 'object',
                    required: [
                        'hop',
                        'number',
                        'unit'
                    ],
                    properties: {
                        hop: {
                            type: 'string',
                            title: 'Hop',
                            enum: hops
                        },
                        number: {
                            type: 'number',
                            title: 'Size',
                        },
                        unit: {
                            type: 'string',
                            title: 'Units',
                            enum: units
                        },
                        acid: {
                            type: 'number',
                            title: 'Alpha Acid Content',
                        }
                    }
                }
            },
            hopsAddition: {
                type: 'array',
                title: 'Hops Addition',
                items: {
                    type: 'object',
                    required: [
                        'hop',
                        'time'
                    ],
                    properties: {
                        hop: {
                            type: 'string',
                            title: 'Hop',
                            enum: hops
                        },
                        time: {
                            type: 'string',
                            title: 'Time',
                            format: 'date-time'
                        }
                    }
                }
            },
            notes: {
                type: 'string',
                title: 'Adjustments / Notes'
            },
            stageStats: {
                title: "Stages Stats",
                type: 'array',
                items: {
                    $ref: '#/definitions/stage_stats'
                }
            },
            fermentorStats: {
                title: "Fermentor Stats",
                type: 'array',
                items: {
                    $ref: '#/definitions/fermentor_stats'
                }
            },
            brightTankStats: {
                title: "Bright Tank Stats",
                type: 'array',
                items: {
                    $ref: '#/definitions/bright_tank_stats'
                }
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