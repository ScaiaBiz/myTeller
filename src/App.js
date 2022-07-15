import React, { useState } from 'react';
import classes from './App.module.css';

import ButtonsBoard from './comps/ButtonsBoard';
import Recap from './comps/Recap';
import Keyboard from './kommon/Keyboard';

function App() {
	const [buyngList, setBuyngList] = useState([]);

	const addToList = element => {
		const el = {
			...element,
			_id: Number(buyngList.length) + 1,
		};
		setBuyngList([...buyngList, el]);
	};

	const removeToList = element => {
		const newList = buyngList.filter(el => {
			if (el._id != element) {
				return true;
			}
		});
		setBuyngList(newList);
	};

	const endOrder = post => {
		if (post === true) {
			console.log('Posto il dato');
		}
		setBuyngList([]);
	};

	return (
		<div className={classes.main}>
			<div className={classes.content}>
				<ButtonsBoard add={addToList} />
			</div>
			<div className={classes.recap}>
				<Recap
					list={buyngList}
					removeElement={removeToList}
					endOrder={endOrder}
				/>
			</div>
		</div>
	);
}

export default App;
/**
 * //TODO: Iniziare compliazione RECAP
 * //TODO: Registrare [articolo, quantità, prezzo, data/ora]
 * //TODO: Calcolare costo totale mappando singoli prezzi x quantità
 *
 *
 * //Todo: Creare pagine settaggi per definire nome e prezzo articolo
 */
