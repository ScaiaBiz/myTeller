import React from 'react';
import classes from './Recap.module.css';

function Recap({ list, removeElement, endOrder }) {
	const printTotalPrice = () => {
		let total = 0;
		list.map(el => {
			total += el.prezzo * el.quantity;
		});
		return total;
	};

	const getListData = () => {
		const data = list.map(el => {
			return (
				<div className={classes.list__element}>
					<div className={classes.list__element__value}>
						<h2>
							{el.quantity} x {el.name} = {el.prezzo * el.quantity}€
						</h2>
					</div>

					<div
						className={classes.list__element__delete}
						on
						onClick={() => removeElement(el._id)}
					>
						<h1>X</h1>
					</div>
				</div>
			);
		});
		return data;
	};

	return (
		<div className={classes.container}>
			<div className={classes.list}>{getListData()}</div>
			<div className={classes.footer}>
				<h1 className={classes.total}>Totale: {printTotalPrice()}</h1>
				<div
					className={`${classes.button} ${classes.confirmation}`}
					onClick={() => endOrder(true)}
				>
					Ok
				</div>
				<div
					className={`${classes.button} ${classes.abort}`}
					onClick={endOrder}
				>
					Annulla
				</div>
			</div>
		</div>
	);
}

export default Recap;
