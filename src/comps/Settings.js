import React, { useState, useEffect } from 'react';

import classes from './Settings.module.css';

function Settings({ clear }) {
	const [data, setData] = useState([]);
	const [visulaData, setVisulaData] = useState(null);

	const getProductsData = async () => {
		const _data = JSON.parse(localStorage.getItem('myTellerData'));
		console.log(_data);
		setData(_data);
	};

	useEffect(() => {
		console.log('creo settings');
		const visual = data.map(d => {
			return (
				<div key={d._id} className={classes.productRow}>
					<span>
						{d.name} - {d.prezzo}€
					</span>{' '}
					<span>Cancella</span>
				</div>
			);
		});
		visual.push(
			<div className={classes.productRow} key={'aggiungi'}>
				<h2> Aggiungi </h2>
			</div>
		);
		setVisulaData(visual);
	}, [data]);

	useEffect(() => {
		getProductsData();
	}, []);

	return (
		<div className={classes.container}>
			<h1 className={classes.closer} onClick={() => clear()}>
				Chiudi
			</h1>
			<p className={classes.productContainer}>{visulaData}</p>
		</div>
	);
}

export default Settings;
