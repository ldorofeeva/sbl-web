import React, { useReducer, useEffect } from 'react';

import './Input.css';
import {validate} from "../../util/validators";

// Reducer function
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        // Copy old state object and overwrite members
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)
      };
    case 'TOUCH':
      return {
        // Copy old state object and overwrite members
        ...state,
        isTouched: true
      };
    default:
      return state;
  }
};

const Input = props => {
  //const [enteredValue, setEnteredValue] = useState('')
  //const [enteredValueValid, setEnteredValueValid] = useState(false)
  //use useReducer for more complex states
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const {id, onInput} = props;
  const {value, isValid} = inputState;

  useEffect(() => {
    onInput(id, value, isValid)
  },[id, onInput, value, isValid]);
  const changeHandler = event => {
    dispatch({type: 'CHANGE', val: event.target.value, validators: props.validators});
  };

  const touchHandler = event => {
    dispatch({type: 'TOUCH'});
  };

  const element =
    props.element === 'input' ? (
      <input
          id={props.id}
          type={props.type}
          placeholder={props.placeholder}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
      />
    ) : (
      <textarea
          id={props.id}
          rows={props.rows || 3}
          onChange={changeHandler}
          onBlur={touchHandler}
          value={inputState.value}
      />
    );

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p> }
    </div>
  );
};

export default Input;
