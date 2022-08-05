import React from 'react';

import classes from './Analytics.module.css';

function Analytics({ clear }) {
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
					{/* Analytics */}
					Totale incassi: {totalEarn.euro}€
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
