import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import classes from './Recap.module.css';

import AskTotale from './AskTotale';

function Recap({ list, setBuyngList, removeElement, endOrder, addNewMessage }) {
	const [showPayment, setShowPayment] = useState(null);

	const showPaymentHandler = () => {
		setShowPayment(!showPayment);
	};

	const printTotalPrice = () => {
		let total = 0;
		list.map(el => {
			total += el.prezzo * el.quantity;
		});
		return total;
	};

	const paymentConfirmation = () => {
		const formPayment = (
			<AskTotale
				list={list}
				totalPrice={printTotalPrice()}
				action={endOrder}
				clear={showPaymentHandler}
			/>
		);

		return ReactDOM.createPortal(
			formPayment,
			document.getElementById('askQty')
		);
	};

	const abortOrder = () => {
		addNewMessage('MESSAGE', 'Ordine annullato');
		setBuyngList([]);
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
		<React.Fragment>
			{showPayment && paymentConfirmation()}
			<div className={classes.container}>
				<div className={classes.list}>{getListData()}</div>
				<div className={classes.footer}>
					<h1 className={classes.total}>Totale: {printTotalPrice()}</h1>
					<div
						className={`${classes.button} ${classes.confirmation}`}
						onClick={showPaymentHandler}
					>
						Pagamento
					</div>
					<div
						className={`${classes.button} ${classes.abort}`}
						onClick={abortOrder}
					>
						Cancella tutto
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Recap;
