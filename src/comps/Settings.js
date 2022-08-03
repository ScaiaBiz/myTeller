import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import AskEdit from './AskEdit';

import classes from './Settings.module.css';

function Settings({ clear }) {
	const [data, setData] = useState([]);
	const [visulaData, setVisulaData] = useState(null);
	const [showAskEdit, setShowAskEdit] = useState(false);
	const [selected, setSelected] = useState(null);
	const [isNew, setIsNew] = useState(false);
	const [reloadNeeded, setReloadNeeded] = useState(false);

	//>>>>>>>>>>>>>>>>>>>> Modifica dati <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	const handelShowAskEdit = () => {
		setShowAskEdit(!showAskEdit);
	};

	const modifySelected = el => {
		handelShowAskEdit();
		let newData = [];
		let count = 0;
		if (isNew) {
			newData = data.map(d => {
				const newEl = { ...d };
				newEl._id = count;
				count++;
				// if (d._id == el._id) {
				// 	newEl.name = el.name;
				// 	newEl.prezzo = Number(el.prezzo);
				// }
				console.log(count);
				console.log(newEl);
				return newEl;
			});
			el._id = count;
			setProductData([...newData, el]);
			setIsNew(false);
		} else {
			newData = data
				.filter(e => {
					if (e.toDelete) {
						console.log('deletto');
						return false;
					}
					return true;
				})
				.map(d => {
					const newEl = { ...d };
					newEl._id = count;
					count++;
					if (d._id == el._id) {
						newEl.name = el.name;
						newEl.prezzo = Number(el.prezzo);
					}
					console.log(count);
					console.log(newEl);
					return newEl;
				});
			setProductData(newData);
		}
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

	const addNewProduct = () => {
		setIsNew(true);
		setSelected('NEW');
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

	const getProductsData = () => {
		const _data = JSON.parse(localStorage.getItem('myTellerData'));
		setData(_data);
	};

	const setProductData = pData => {
		console.log(pData);
		localStorage.setItem('myTellerData', JSON.stringify(pData));
		setReloadNeeded(true);
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
				<h1 className={classes.closer} onClick={() => clear(reloadNeeded)}>
					Chiudi
				</h1>
				<div className={classes.productContainer}>{visulaData}</div>
				<h1 className={classes.productAdd} onClick={addNewProduct}>
					Aggiungi
				</h1>
			</div>
		</React.Fragment>
	);
}

export default Settings;
