import React from 'react';
import classes from './ProductCard.module.css';

function ProductCard({ btn, setSelected, index }) {
	const lastPos = index;
	return (
		<div
			key={btn._id}
			className={classes.button}
			style={{
				backgroundColor: `var(--${
					'btn' + lastPos.toString()[lastPos.toString().length - 1]
				})`,
			}}
			onClick={() => setSelected(btn)}
		>
			<h1>{btn.name}</h1>
			<h2>{btn.price}€</h2>
		</div>
	);
}

export default ProductCard;
