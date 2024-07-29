// So the we could use JSX
import React from 'react';
import Card from "../../shared/components/UIElements/Card";

import "../../shared/components/UIElements/List.css"
import BatchItem from "./BatchItem";
import Button from "../../shared/components/FormElements/Button";


const BatchList = props => {
    console.log(props.items)
    if (props.items.length === 0) {
        return (
            <div className="list center">
                <Card>
                    <h2>No batches found. Maybe create one?</h2>
                    <Button to={"/batches/new"}>Share batch</Button>
                </Card>
            </div>
        );
    }

    return <ul className="list">
        {props.items.map(batch => {
            return <BatchItem
                key={batch.name}
                id={batch.id}
                date={batch.date}
                size={batch.size}
                onDelete={props.onDelete}
            />
        })}
    </ul>;
};

export default BatchList;