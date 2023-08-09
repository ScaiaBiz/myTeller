import React, { useReducer, useEffect } from 'react';

import { validate } from '../validators';

import classes from './Input.module.css';

const inputReducer = (state, action) => {
	switch (action.type) {
		case 'CHANGE':
			return {
				...state,
				value: action.val,
				isValid: validate(action.val, action.validators),
			};

		case 'TOUCH':
			return {
				...state,
				isTuched: true,
			};

		default:
			return state;
	}
};

const Input = props => {
	const [inputState, dispatch] = useReducer(inputReducer, {
		value: props.initValue || '',
		isTuched: false,
		isValid: props.initIsValid || false,
	});

	const { id, onInput } = props;
	const { value, isValid } = inputState;

	useEffect(() => {
		onInput(id, value, isValid);
	}, [id, value, isValid, onInput]);

	const changeHandler = e => {
		dispatch({
			type: 'CHANGE',
			val: e.target.value,
			validators: props.validators,
		});
	};

	const clear = e => {
		e.target.value = '';
	};

	const toucHandler = () => {
		dispatch({ type: 'TOUCH' });
	};

	//todo: Create stato start time/end time registrare il valore DATE di inizio e quello di fine

	const getDateNow = e => {
		const date = new Date();
		// let _d = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
		let _d =
			date.getFullYear() +
			'-' +
			(date.getMonth() + 1) +
			'-' +
			('0' + date.getDate()).slice(-2);
		e.target.value = _d.toString();
		dispatch({
			type: 'CHANGE',
			val: e.target.value,
			validators: props.validators,
		});
	};

	const getTimeNow = e => {
		const time = new Date();
		let _t = time.getHours() + ':' + time.getMinutes();
		e.target.value = _t.toString();
		changeHandler(e);
	};

	const getDropdownList = e => {
		if (props.baseList) {
			switch (props.baseList) {
				default:
					break;
			}
		} else {
			return props.list;
		}
	};

	const element = () => {
		switch (props.element) {
			case 'input':
				return (
					<input
						key={props.id}
						id={props.id}
						type={props.type}
						placeholder={props.placeholder}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
						onClick={props.onClick}
						style={props.style || { textAlign: 'center' }}
					/>
				);
			case 'value':
				return (
					<input
						key={props.id}
						id={props.id}
						type={props.type || 'number'}
						placeholder={props.placeholder}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
						onClick={props.onClick}
						style={props.style || { textAlign: 'center' }}
						// autoFocus={props.autoFocus}
					/>
				);
			case 'checkbox':
				return (
					<input
						key={props.id}
						id={props.id}
						type={props.type}
						onChange={changeHandler}
						onBlur={toucHandler}
						defaultChecked={props.initValue}
						// value='' //{inputState.value}
						className={classes.checkbox}
						onClick={props.onClick}
					/>
				);
			case 'radio':
				return (
					<div className={classes.radio}>
						{props.list?.map(el => {
							return (
								<label
									key={el.id}
									className={classes.radio_dot}
									htmlFor={props.id}
								>
									<input
										className={classes.radio_input}
										id={el.id}
										radioValue={el.name}
										type={props.type}
										onChange={changeHandler}
										onBlur={toucHandler}
										onClick={props.onClick}
										// onClick={e => {
										// 	console.log('Dispaccio');
										// 	dispatch({
										// 		type: 'CHANGE',
										// 		val: e.target.radioValue,
										// 		validators: props.validators,
										// 	});
										// }}
										value={el.name}
										name={props.label}
									/>
									<div className={classes.radio_label}>{el.name}</div>
								</label>
							);
						})}
					</div>
				);

			case 'time':
				return (
					<input
						key={props.id}
						id={props.id}
						type={props.type}
						onClick={getTimeNow}
						onChange={changeHandler}
						onBlur={toucHandler}
						step='900'
						value={inputState.value || getTimeNow()}
					/>
				);
			case 'date':
				return (
					<input
						key={props.id}
						id={props.id}
						type={props.type}
						onClick={getDateNow}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			case 'color':
				return (
					<input
						key={props.id}
						id={props.id}
						type={props.type}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
					/>
				);
			case 'dropdown':
				const list = getDropdownList();
				return (
					<React.Fragment>
						<input
							key={props.id}
							id={props.id}
							list={props.label}
							name={props.id}
							onMouseDown={clear}
							onFocus={clear}
							onChange={changeHandler}
							onBlur={toucHandler}
							value={inputState.value}
							className={`${classes[props.element]} ${
								classes[props.baseList]
							}  ${props.list.length === 0 && classes.noListData}`}
							onClick={props.onClick}
						/>
						<datalist id={props.label}>
							{list?.map(el => {
								return <option value={el.name} />;
							})}
						</datalist>
					</React.Fragment>
				);
			case 'textarea':
				return (
					<textarea
						key={props.id}
						id={props.id}
						type={props.type}
						rows={props.rows || 3}
						onChange={changeHandler}
						onBlur={toucHandler}
						value={inputState.value}
						onClick={props.onClick}
						placeholder={props.placeholder}
					/>
				);
			default:
				break;
		}
	};

	return (
		<div
			className={`${classes.formCtrl} ${
				!inputState.isValid && inputState.isTuched && classes.formCtrl_invalid
			} ${props.elementType && classes.formCtrl__small}`}
			style={{ width: props.width }}
		>
			<label className={classes.label} htmlFor={props.id}>
				{props.label}
			</label>

			{element()}

			{!inputState.isValid &&
				inputState.isTuched &&
				props.errorText !== 'none' && (
					<p id={props.id} className={classes.errorText}>
						{props.errorText}
					</p>
					// ) : (
					// 	<p
					// 		id={props.id}
					// 		className={classes.errorText}
					// 		style={{ visibility: 'hidden' }}
					// 	>
					// 		{props.errorText}
					// 	</p>
				)}
		</div>
	);
};

export default Input;
/**
 * 
 * ====================
 * ESEMPI
 * ====================
 * 
 * Radio:
 * ----------------
 * <Input
		id='radio'
		element='radio'
		type='radio'
		label='Attività svolta: '
		validators={[VALIDATOR_REQUIRE()]}
		onInput={inputHandler}
		initValue={false}
		initIsValid={false}
		list={[
			{ id: 1, name: 'Analisi' },
			{ id: 2, name: 'Assistenza' },
			{ id: 3, name: 'Consulenza' },
			{ id: 4, name: 'Progettazione' },
			{ id: 5, name: 'Programmazione' },
		]}
	/>
 * 

 */
