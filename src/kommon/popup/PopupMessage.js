import React, { useState, useEffect } from 'react';

import classes from './PopupMessage.module.css';

function PopupMessage({ message, clear, timeout = 2000 }) {
	const [toRemove, setToRemove] = useState('');

	useEffect(() => {
		clear(toRemove);
	}, [toRemove]);

	useEffect(() => {
		setTimeout(() => {
			setToRemove(message._id);
		}, timeout);
	}, []);

	return (
		<div
			className={`${classes.container} ${classes[message.type]}`}
			onClick={() => clear(message._id)}
		>
			{message.text}
		</div>
	);
}

export default PopupMessage;
