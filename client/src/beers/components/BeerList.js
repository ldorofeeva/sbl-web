// So the we could use JSX
import React from 'react';
import Card from "../../shared/components/UIElements/Card";

import "./BeerList.css"
import BeerItem from "./BeerItem";
import Button from "../../shared/components/FormElements/Button";


const BeerList = props => {
    console.log(props.items)
    if (props.items.length === 0) {
        return (
            <div className="place-list center">
                <Card>
                    <h2>No beers found. Maybe create one?</h2>
                    <Button to={"/beers/new"}>Share beer</Button>
                </Card>
            </div>
        );
    }

    return <ul className="place-list">
        {props.items.map(beer => {
            return <BeerItem
                key={beer.name}
                id={beer.name}
                name={beer.name}
                hops={beer.hops}
                malts={beer.malts}
                onDelete={props.onDelete}
            />
        })}
    </ul>;
};

export default BeerList;