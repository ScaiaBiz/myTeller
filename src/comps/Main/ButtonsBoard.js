import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// import buttons from '../../data/buttons.json';

import classes from './ButtonsBoard.module.css';

import ProductCard from '../../kommon/ProductCard';
import AskQuantity from './AskQuantity';

function ButtonsBoard({ add, event }) {
	const _buttons = event.articles;
	const [buttonsData, setButtonsData] = useState(event.articles);
	const [showAskQty, setShowAskQty] = useState(false);
	const [selected, setSelected] = useState(null);

	const showAskQtyHandler = () => {
		setShowAskQty(!showAskQty);
	};

	const showAskQuantity = () => {
		const formNewQty = (
			<AskQuantity
				item={selected}
				clear={showAskQtyHandler}
				confirm={addSelectedToList}
			/>
		);
		return ReactDOM.createPortal(formNewQty, document.getElementById('askQty'));
	};

	const addSelectedToList = qty => {
		const el = { ...selected, quantity: qty };
		add(el);
		showAskQtyHandler();
	};

	useEffect(() => {
		if (selected) {
			showAskQtyHandler();
		}
	}, [selected]);

	useEffect(() => {
		if (!showAskQty) {
			setSelected(null);
		}
	}, [showAskQty]);

	useEffect(() => {
		// const _data = localStorage.getItem('myTellerData');
		// if (!_data) {
		// console.log('LocalStorage vuoto');
		// localStorage.setItem('myTellerData', JSON.stringify(_buttons));
		setButtonsData(_buttons);
		// } else {
		// setButtonsData(JSON.parse(_data));
		// }
	}, []);

	const getButtons = () => {
		const but = buttonsData?.map((btn, i) => {
			return (
				<ProductCard
					key={btn._id}
					btn={btn}
					setSelected={setSelected}
					index={i}
				/>
			);
		});
		return but;
	};

	return (
		<React.Fragment>
			{showAskQty && showAskQuantity()}
			<div className={classes.container}>
				<div className={classes.buttons}>{getButtons()}</div>
			</div>
		</React.Fragment>
	);
}

export default ButtonsBoard;
