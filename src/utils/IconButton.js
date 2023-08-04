import React from 'react';

import './IconButton.module.css';

function IconButton({ type, action, text, style }) {
	if (text) {
		return (
			<span className='material-icons' onClick={action} style={style}>
				{text}
			</span>
		);
	}

	return <>Errore</>;
}

export default IconButton;
