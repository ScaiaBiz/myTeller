import React, { useState, useEffect } from 'react';
import classes from './AskQuantity.module.css';

import Button from '../../kommon/Button';
import Keyboard from '../../kommon/Keyboard';

function AskQuantity({ item, confirm, clear }) {
	const [qty, setQty] = useState('0');
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
					<div>
						<p className={classes.itemName}>{item.name}</p>
						{Number(item.price)}€
					</div>
					<div className={classes.priceInfo}>
						<div>
							Quantità:
							<p>{Number(qty)}</p>
						</div>
						<div>
							Totale:
							<p style={Number(qty) > 0 ? { color: `var(--abort)` } : {}}>
								{Number(item.price) * Number(qty)}€
							</p>
						</div>
					</div>
					<Keyboard action={changeQty} />
				</div>
				<div className={`${classes.culumns} ${classes.right}`}>
					<Button
						value='Annulla'
						clname={`abort button`}
						action={clear}
					></Button>
					<Button
						value='Ok'
						clname='confirm button confirmation'
						c='test'
						action={() => Number(qty) > 0 && confirm(Number(qty))}
					></Button>
				</div>
			</div>
		</React.Fragment>
	);
}

export default AskQuantity;
