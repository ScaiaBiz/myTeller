import React from 'react';

import classes from './Button.module.css';

const Button = props => {
	const btncls = () => {
		if (props.clname) {
			const bclass = props.clname.split(' ').map(c => {
				return classes[c];
			});
			return bclass.join(' ');
		}
		return classes.default;
	};

	if (props.href) {
		return (
			<a className={'base ' + props.clname} href={props.href}>
				{props.children}
			</a>
		);
	}
	if (props.to) {
		return; //(
		// <Link to={props.to} exact={props.exact} className={clname || 'default'}>
		// 	{props.children}
		// </Link>
		// );
	}

	return (
		<button
			className={classes.base + ' ' + btncls()}
			style={props.style}
			type={props.type}
			onClick={props.onClick}
			disabled={props.disabled}
			autoFocus={props.autofocus}
		>
			{props.children}
		</button>
	);
};

export default Button;
