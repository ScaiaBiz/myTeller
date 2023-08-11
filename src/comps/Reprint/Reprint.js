import React, { useState, useEffect } from 'react';

import classes from './Reprint.module.css';

import Button from '../../kommon/Button';

function Reprint({ list, endOrder, clear }) {
	const [buyngList, setBuyngList] = useState(list.productsList);
	const [listData, setListData] = useState(null);

	const printTotalPrice = () => {
		let total = 0;
		buyngList.map(el => {
			total += el.price * el.quantity;
		});
		return total;
	};

	const abortOrder = () => {
		clear();
	};

	const getListData = () => {
		const data = buyngList.map((el, i) => {
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
		setListData(data);
	};

	const removeElement = element => {
		const newList = buyngList.filter(el => {
			if (el.listId != element) {
				return true;
			}
		});
		const reordered = newList.map((el, i) => {
			el.listId = i;
			return el;
		});
		setBuyngList(reordered);
	};

	const changePrintFormat = element => {
		const newList = buyngList.map((el, i) => {
			if (el.listId == element) {
				switch (el.type) {
					case 'card':
						el.type = 'text';
						break;
					case 'text':
						el.type = 'card';
						break;
				}
			}
			el.listId = i;
			return el;
		});
		setBuyngList(newList);
	};

	const lounchReprint = () => {
		endOrder(buyngList);
	};

	useEffect(() => {
		console.log(buyngList);
		getListData();
	}, [buyngList]);

	return (
		<React.Fragment>
			<div className={classes.background} onClick={abortOrder}></div>
			<div className={classes.wrapper}>
				<div className={classes.list}>
					<div className={classes.list_header}>Testata</div>
					{listData}
					<div className={classes.list_footer}>
						Totale: {printTotalPrice()}€
					</div>
				</div>
				<div className={classes.footer}>
					<h1 className={classes.total}>Totale: {printTotalPrice()}€</h1>
					{/* <Button value={'test'} action={manualTrigger} /> */}
					<Button
						value={'Ristampa'}
						clname={'confirm'}
						action={lounchReprint}
						disabled={buyngList.length === 0}
					/>
					<Button value={'Annulla'} clname={'abort'} action={abortOrder} />
				</div>
			</div>
		</React.Fragment>
	);
}

export default Reprint;
