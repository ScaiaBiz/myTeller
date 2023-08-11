import React, { useState } from 'react';

import classes from './Analytics.module.css';

function Analytics({ event, clear }) {
	let totalEarn = event.totalEarn;

	const getProductsEearn = () => {
		let productsEarns = event.transactionsRecacp;
		console.log({ productsEarns });
		if (productsEarns) {
			const _list = productsEarns.map(p => {
				console.log(p);
				return (
					<div className={classes.prodLine}>
						<span className={classes.prodLine__data}>{p.name}</span>{' '}
						<span className={classes.prodLine__data}>Prezzo: {p.price}€</span>{' '}
						<span className={classes.prodLine__nr}>Pz: {p.quantity}</span>{' '}
						<span className={classes.prodLine__data}>Tot: {p.totEarn}€</span>
					</div>
				);
			});
			return _list;
		}
	};

	return (
		<div className={classes.container}>
			<h1 className={classes.closer} onClick={() => clear()}>
				Chiudi
			</h1>
			<div className={classes.data}>
				<h1
					className={classes.total}
					onClick={() => console.log('Analytics cliccato')}
				>
					Totale incassi: {totalEarn?.euro}€
				</h1>
				<div className={classes.specification}>
					Di cui:
					{getProductsEearn()}
				</div>
			</div>
		</div>
	);
}

export default Analytics;
