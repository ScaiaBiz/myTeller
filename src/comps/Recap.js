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
						{`${el.quantity} x ${el.name} = ${el.prezzo * el.quantity}€`}
					</div>

					<div
						className={classes.list__element__delete}
						on
						onClick={() => removeElement(el._id)}
					>
						X
					</div>
				</div>
			);
		});
		return data;
	};

	// const printTest =

	const a = {
		0: {
			type: 0,
			content: 'My Business Title',
			bold: 1,
			align: 2,
			format: 3,
		},
		1: {
			type: 2,
			value: '1234567890123',
			width: 300,
			height: 150,
			align: 0,
		},
		2: { type: 3, value: 'sample qr text', size: 40, align: 2 },
		3: {
			type: 4,
			content:
				'<div align="center" style="font-size:17px;"></b>This is an HTML text</b></div><br /><br />Another text',
		},
		4: { type: 0, content: ' ', bold: 0, align: 0 },
		5: {
			type: 0,
			content: 'This text has<br />two lines',
			bold: 0,
			align: 0,
		},
	};

	return (
		<React.Fragment>
			{showPayment && paymentConfirmation()}
			<div className={classes.container}>
				<div className={classes.list}>
					<div className={classes.list_header}>Testata</div>
					{getListData()}
					<div className={classes.list_footer}>
						Totale: {printTotalPrice()}€
					</div>
				</div>
				<div className={classes.footer}>
					<h1 className={classes.total}>Totale: {printTotalPrice()}€</h1>
					<div
						className={`${classes.button} ${classes.print}`}
						// onClick={() => window.print()}
					>
						<a href='my.bluetoothprint.scheme://http://192.168.1.12:3001/getProudctButtons'>
							Stampa
						</a>
					</div>
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
