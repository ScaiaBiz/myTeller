import React from 'react';

import classes from './Keyboard.module.css';

import key_numbers from '../data/key_numbers.json';

function Keyboard({ action }) {
	const k_nubers = key_numbers.data;
	return (
		<div className={classes.container}>
			<div className={classes.buttons}>
				{k_nubers.map(b => {
					return (
						<div
							key={b.value}
							className={classes.keyNumb}
							onClick={() => action(b.value)}
						>
							{b.value}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Keyboard;
