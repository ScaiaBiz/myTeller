import React from 'react';
import classes from './ProductCard.module.css';

function ProductCard({ btn, setSelected }) {
	return (
		<div
			key={btn._id}
			className={classes.button}
			style={{ backgroundColor: `var(--${'btn' + btn._id})` }}
			onClick={() => setSelected(btn)}
		>
			<h1>{btn.name}</h1>
			<h2>{btn.prezzo}€</h2>
		</div>
	);
}

export default ProductCard;
