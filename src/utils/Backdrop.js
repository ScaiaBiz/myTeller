import React from 'react';
import ReactDOM from 'react-dom';

import classes from './Backdrop.module.css';

const Backdrop = props => {
	console.log('livello ' + props.level);

	return ReactDOM.createPortal(
		<div className={`${classes.backdrop}`} onClick={props.onClick}></div>,
		document.getElementById('backdrop')
	);
};

export default Backdrop;
