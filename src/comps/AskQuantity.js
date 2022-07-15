import React, { useState, useEffect } from 'react';
import classes from './AskQuantity.module.css';

import Keyboard from '../kommon/Keyboard';

function AskQuantity({ item, confirm, clear }) {
	const [qty, setQty] = useState('1');
	const [isFirst, setIsFirst] = useState(true);

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

	return (
		<React.Fragment>
			<div className={classes?.hoverBackground} onClick={clear} />
			<div className={classes.container}>
				<div className={`${classes.culumns} ${classes.left}`}>
					<h2>
						<h1 className={classes.itemName}>{item.name}</h1> Prezzo:{' '}
						{Number(item.prezzo)}€
					</h2>
					<div className={classes.priceInfo}>
						<h1>
							Quantità:
							<p>{Number(qty)}</p>
						</h1>
						<h1>
							Totale:
							<p style={Number(qty) > 0 ? { color: `var(--abort)` } : {}}>
								{Number(item.prezzo) * Number(qty)}€
							</p>
						</h1>
					</div>
					<Keyboard action={changeQty} />
				</div>
				<div className={`${classes.culumns} ${classes.right}`}>
					<div className={`${classes.button} ${classes.abort}`} onClick={clear}>
						Annulla
					</div>
					<div
						className={`${classes.button} ${classes.confirmation}`}
						onClick={() => confirm(Number(qty))}
					>
						Ok
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default AskQuantity;
