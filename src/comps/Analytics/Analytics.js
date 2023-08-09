import React, { useState } from 'react';

import classes from './Analytics.module.css';

function Analytics({ clear }) {
	const [update, setUpdate] = useState(false);

	let totalEarn = JSON.parse(window.localStorage.getItem('myTellerTotalEarn'));

	const getProductsEearn = () => {
		let productsEarns = JSON.parse(
			window.localStorage.getItem('myTellerTotalQuantity')
		);
		console.log({ productsEarns });
		if (productsEarns) {
			const _list = Object.keys(productsEarns).map(p => {
				console.log(productsEarns[p]);
				return (
					<div className={classes.prodLine}>
						<span className={classes.prodLine__data}>
							{productsEarns[p].name}
						</span>{' '}
						<span className={classes.prodLine__data}>
							Prezzo: {productsEarns[p].price}€
						</span>{' '}
						<span className={classes.prodLine__nr}>
							Pz. {productsEarns[p].qty}
						</span>{' '}
						<span className={classes.prodLine__data}>
							Tot: {productsEarns[p].totEarn}€
						</span>
					</div>
				);
			});
			return _list;
		}
	};

	const resetEarnsData = () => {
		console.log('Azzero dati in localStorage');
		// localStorage.setItem('myTellerData', JSON.stringify(pData));
		localStorage.setItem('myTellerMovments', JSON.stringify([]));
		localStorage.setItem('myTellerTotalQuantity', JSON.stringify([]));
		localStorage.setItem('myTellerTotalEarn', JSON.stringify({ euro: 0 }));
		setUpdate(!update);
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
				<h1 className={classes.reset} onClick={resetEarnsData} update>
					Cancella dati incassi
				</h1>
			</div>
		</div>
	);
}

export default Analytics;
