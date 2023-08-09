import React from 'react';

import classes from './Button.module.css';

function Button({ value, clname, action, disabled, autofocus = false }) {
	const btncls = () => {
		if (clname && !disabled) {
			const bclass = clname.split(' ').map(c => {
				return classes[c];
			});
			return bclass.join(' ');
		}
		return classes.default;
	};

	return (
		<button
			className={`${classes.base} ${btncls()}`}
			onClick={action}
			disabled={disabled}
			autoFocus={autofocus}
		>
			{value}
		</button>
	);
}

export default Button;
