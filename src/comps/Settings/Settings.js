import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';

import classes from './Settings.module.css';

import { UserCxt } from '../../cxt/ctxUser';

import AskEdit from './AskEdit';

import { useHttpClient } from '../../hooks/http-hooks';
import ErrorModal from '../../utils/ErrorModal';
import LoadingSpinner from '../../utils/LoadingSpinner';

function Settings({ clear }) {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useContext(UserCxt).user;
	const [company, setCompany] = useContext(UserCxt).company;
	const [event, setEvent] = useContext(UserCxt).event;
	const [forceUserLogout, setForceUserLogout] =
		useContext(UserCxt).handleUserLogout;

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

	const modifySelected = async art => {
		handelShowAskEdit();
		const updated = await sendRequest(
			'event/editArticle',
			'POST',
			{
				eventId: event._id,
				isNew: isNew,
				art: art,
			},
			{
				'Content-Type': 'application/json',
			}
		);
		if (isNew) {
			setIsNew(false);
		}
		setEvent(updated);
		setData(updated.articles);
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
		setSelected('NEW');
	};

	useEffect(() => {
		if (!showAskEdit) {
			setSelected(null);
		}
	}, [showAskEdit]);

	useEffect(() => {
		if (selected) {
			if (selected === 'NEW') {
				setIsNew(true);
			} else {
				setIsNew(false);
			}
			handelShowAskEdit();
		}
	}, [selected]);

	//>>>>>>>>>>>>>>>>>>>> Gestisci dati prodotti <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

	const getProductsData = async () => {
		// const _data = JSON.parse(localStorage.getItem('myTellerData'));
		const _data = await sendRequest(`event/articlesList/${event._id}`);
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
					<span className={classes.productPrice}>{d.price}€</span>
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

	/**
	 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	 *
	 * Gestione caricamenti COMPANY e EVENT
	 *
	 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	 */

	return (
		<React.Fragment>
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}
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
