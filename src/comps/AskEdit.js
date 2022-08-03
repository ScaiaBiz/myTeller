import React, { useState, useEffect } from 'react';

import classes from './AskEdit.module.css';

function AskEdit({ item, clear, confirm }) {
	let itm = item;
	if (item === 'NEW') {
		itm = { _id: Date.now(), name: '', prezzo: '' };
		item = null;
	}

	const [itemData, setItemData] = useState(itm);

	const inputHandler = e => {
		const value = e.target.value;
		const target = e.target.id;
		const newData = { ...itemData };
		newData[target] = value;
		setItemData(newData);
	};

	const doAction = e => {
		const newData = itemData;
		console.log('AksEdit');
		console.log(newData);
		newData.toDelete = document.getElementById('deleteProduct').checked;
		confirm(newData);
	};

	return (
		<React.Fragment>
			<div className={classes?.container} onClick={clear} />
			<div className={classes.content}>
				<h1>
					{itemData.name} - {itemData.prezzo}€
				</h1>
				<form className={classes.editForm}>
					<label htmlFor='name'>Prodotto:</label>
					<input
						className={classes.editInput}
						type='text'
						id='name'
						placeholder='Inserisci nome prodotto'
						value={itemData ? itemData.name : ''}
						onInput={inputHandler}
					/>
					<label htmlFor='prezzo'>Prezzo:</label>
					<input
						className={classes.editInput}
						type='number'
						id='prezzo'
						placeholder='Prezzo'
						value={itemData ? itemData.prezzo : ''}
						onInput={inputHandler}
					/>
					<label className={classes.checkDelete}>
						<input
							id='deleteProduct'
							type='checkbox'
							className={classes.checkbox}
						/>
						Elimina articolo
					</label>
				</form>
				<div className={classes.buttons}>
					<span
						className={`${classes.btn} ${classes.btnSave}`}
						onClick={doAction}
					>
						Salva
					</span>
					<span
						className={`${classes.btn} ${classes.btnAbort}`}
						onClick={clear}
					>
						Annulla
					</span>
				</div>
			</div>
		</React.Fragment>
	);
}

export default AskEdit;
