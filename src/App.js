import React, { useState, useEffect, useRef } from 'react';
import classes from './App.module.css';

import PopupBoard from './kommon/popup/PopupBoard';
import ButtonsBoard from './comps/ButtonsBoard';
import Recap from './comps/Recap';

import { usePopupMes } from './hooks/usePopupMes';

function App() {
	//PopupMessage ---------------------------------------------
	// const { removeMessage, messages, addNewMessage } = usePopupMes();

	//fixme: Meglio ma non meglissimo verificare come gestire con un hook o con useReducer

	const [messages, setMessages] = useState([]);
	const [count, setCount] = useState(1);

	const ref = useRef('');

	useEffect(() => {
		ref.current = count;
		// console.log(ref.current);
	}, [count]);

	const removeMessage = id => {
		const mes = messages.filter(m => {
			return id != m._id;
		});
		setMessages(mes);
	};

	const addNewMessage = (type, text) => {
		// console.log('Aggiungo messaggio: ' + text);
		const newMessage = {
			_id: Date.now(),
			type: type,
			text: ref.current + ': ' + text,
		};
		const mess = [newMessage, ...messages];
		setMessages(mess);
		setCount(count + 1);
		// console.log('messaggio aggiunto');
		if (type === 'ERROR') {
			return false;
		}
		return true;
	};

	//Shopping List Handler ------------------------------------
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
		let _result;
		if (post === true) {
			console.log('Posto il dato');
			_result = addNewMessage('OK', 'Nuovo incasso registrato');
		} else {
			console.log('Post non confermato');
			_result = addNewMessage('ERROR', 'Impossibile registrare incasso');
		}
		_result && setBuyngList([]);
	};

	return (
		<div className={classes.main}>
			<PopupBoard
				messages={messages}
				removeMessage={removeMessage}
				addNewMessage={addNewMessage}
			/>
			<div className={classes.content}>
				<ButtonsBoard add={addToList} />
			</div>
			<div className={classes.recap}>
				<Recap
					list={buyngList}
					setBuyngList={setBuyngList}
					removeElement={removeToList}
					endOrder={endOrder}
					addNewMessage={addNewMessage}
				/>
			</div>
		</div>
	);
}

export default App;
/**
 * //TODO: Registrare [articolo, quantità, prezzo, data/ora]
 * //TODO: Creare pagina setup articoli
 *
 * //Todo: Creare pagine settaggi per definire nome e prezzo articolo
 */
