import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import AskEdit from './AskEdit';

import classes from './Settings.module.css';

function Settings({ clear }) {
	const [data, setData] = useState([]);
	const [visulaData, setVisulaData] = useState(null);
	const [showAskEdit, setShowAskEdit] = useState(false);
	const [selected, setSelected] = useState(null);

	//>>>>>>>>>>>>>>>>>>>> Modifica dati <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	const handelShowAskEdit = () => {
		setShowAskEdit(!showAskEdit);
	};

	const modifySelected = el => {
		handelShowAskEdit();
		// console.log(el);
		// console.log('');
		const newData = data
			.filter(e => {
				if (e.toDelete) {
					console.log('deletto');
					return false;
				}
				return true;
			})
			.map(d => {
				// console.log(d);
				if (d._id == el._id) {
					// console.log('Trovato elemento da modificare:');
					const newEl = { ...d };
					newEl._id = el._id;
					newEl.name = el.name;
					newEl.prezzo = Number(el.prezzo);
					// console.log('Nuovo elemento:');
					// console.log(newEl);
					return newEl;
				}
				return d;
			});

		setProductData(newData);
	};

	const activateAskEdit = () => {
		const formEdit = (
			<AskEdit
				item={selected}
				clear={handelShowAskEdit}
				confirm={modifySelected}
			/>
		);
		return ReactDOM.createPortal(formEdit, document.getElementById('askQty'));
	};

	useEffect(() => {
		if (!showAskEdit) {
			setSelected(null);
		}
	}, [showAskEdit]);

	useEffect(() => {
		if (selected) {
			handelShowAskEdit();
		}
	}, [selected]);

	//>>>>>>>>>>>>>>>>>>>> Gestisci dati prodotti <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	const getProductsData = async () => {
		const _data = JSON.parse(localStorage.getItem('myTellerData'));
		console.log(_data);
		setData(_data);
	};

	const setProductData = async pData => {
		localStorage.setItem('myTellerData', JSON.stringify(pData));
		getProductsData();
	};

	useEffect(() => {
		const visual = data.map(d => {
			return (
				<div key={d._id} className={classes.productRow}>
					<span className={classes.productName}>{d.name}</span>
					<span className={classes.productPrice}>{d.prezzo}€</span>
					<span
						className={classes.edit}
						onClick={() => {
							setSelected(d);
						}}
					>
						Modifica
					</span>
				</div>
			);
		});
		setVisulaData(visual);
	}, [data]);

	useEffect(() => {
		getProductsData();
	}, []);

	return (
		<React.Fragment>
			{showAskEdit && activateAskEdit()}
			<div className={classes.container}>
				<h1 className={classes.closer} onClick={() => clear()}>
					Chiudi
				</h1>
				<p className={classes.productContainer}>{visulaData}</p>
				<h1 className={classes.productAdd}>Aggiungi</h1>
			</div>
		</React.Fragment>
	);
}

export default Settings;
