import React, { useState, useEffect } from 'react';
import classes from './AskTotale.module.css';

import Keyboard from '../../kommon/Keyboard';

import { usePopupMes } from '../../hooks/usePopupMes';

function AskTotale({ list, totalPrice, action, clear }) {
	const [qty, setQty] = useState('0');
	const [isFirst, setIsFirst] = useState(true);

	// const {}=usePopupMes()

	const changeQty = value => {
		switch (value) {
			case '<<':
				if (qty.length > 1) {
					let _qty = qty.split('');
					_qty.pop();
					setQty(_qty.join(''));
					break;
				}
				setQty('0');
				break;
			case 'Canc':
				setQty('0');
				break;

			default:
				if (isFirst) {
					setQty(value);
					setIsFirst(false);
					break;
				}
				setQty(qty + value);
				break;
		}
	};

	const confirmation = () => {
		action(totalPrice > 0 || qty > 0, totalPrice || qty);
		clear();
	};

	return (
		<React.Fragment>
			<div className={classes?.hoverBackground} onClick={clear} />
			<div className={classes.container}>
				<div className={`${classes.culumns} ${classes.left}`}>
					<h1 className={classes.itemName}>Totale: {Number(totalPrice)}€</h1>
					<h1>Dato: {Number(qty)}</h1>
					<h1>
						Resto:{' '}
						<b style={Number(qty) > 0 ? { color: `var(--confirm)` } : {}}>
							{Number(qty) > 0 ? Number(qty) - Number(totalPrice) : '0'}€
						</b>
					</h1>
					<Keyboard action={changeQty} />
				</div>
				<div className={`${classes.culumns} ${classes.right}`}>
					<div className={`${classes.button} ${classes.abort}`} onClick={clear}>
						Annulla
					</div>
					<div
						className={`${classes.button} ${classes.confirmation}`}
						onClick={confirmation}
					>
						Esegui
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default AskTotale;
