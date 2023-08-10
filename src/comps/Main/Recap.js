import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import classes from './Recap.module.css';

import AskTotale from './AskTotale';

import Button from '../../kommon/Button';

function Recap({
	list,
	setBuyngList,
	removeElement,
	changePrintFormat,
	endOrder,
	addNewMessage,
}) {
	const [showPayment, setShowPayment] = useState(null);

	const showPaymentHandler = () => {
		setShowPayment(!showPayment);
	};

	const printTotalPrice = () => {
		let total = 0;
		list.map(el => {
			total += el.price * el.quantity;
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
		const data = list.map((el, i) => {
			return (
				<div key={i} className={classes.list__element}>
					<div className={classes.list__element__value}>
						<input
							className={classes.checkbox}
							type='checkbox'
							value={Boolean(el.type === 'card')}
							onClick={() => changePrintFormat(el.listId)}
						/>
						<p
							className={classes.description}
						>{`${el.quantity} x ${el.name}`}</p>
						<p className={classes.rowTot}>{`${el.price * el.quantity}€`}</p>
					</div>

					<Button
						action={() => removeElement(el.listId)}
						value={'X'}
						clname={'abort small'}
					>
						X
					</Button>
				</div>
			);
		});
		return data;
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
					{/* <Button value={'test'} action={manualTrigger} /> */}
					<Button
						value={'Incassa'}
						clname={'confirm'}
						action={showPaymentHandler}
						disabled={list.length === 0}
					/>
					<Button
						value={'Cancella ordine'}
						clname={'abort'}
						action={abortOrder}
						disabled={list.length === 0}
					/>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Recap;
