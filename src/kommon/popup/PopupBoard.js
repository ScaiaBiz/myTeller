import React, { useState, useEffect, useRef } from 'react';

import classes from './PopupBoard.module.css';

import PopupMessage from './PopupMessage';
import { usePopupMes } from '../../hooks/usePopupMes';

function PopupBoard({ removeMessage, messages, addNewMessage }) {
	// const { removeMessage, messages, addNewMessage } = usePopupMes();

	return (
		<div className={classes.container}>
			{messages.map(m => {
				return <PopupMessage key={m._id} message={m} clear={removeMessage} />;
			})}
		</div>
	);
}

export default PopupBoard;
