import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import classes from './App.module.css';

import PopupBoard from './kommon/popup/PopupBoard';
import ButtonsBoard from './comps/ButtonsBoard';
import Recap from './comps/Recap';

import Settings from './comps/Settings';

import iconSettings from './assets/settings_48.png';
import iconChart from './assets/chart_48.png';

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
	}, [count]);

	const removeMessage = id => {
		const mes = messages.filter(m => {
			return id != m._id;
		});
		setMessages(mes);
	};

	const addNewMessage = (type, text) => {
		const newMessage = {
			_id: Date.now(),
			type: type,
			text: ref.current + ': ' + text,
		};
		const mess = [newMessage, ...messages];
		setMessages(mess);
		setCount(count + 1);
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
			_result = addNewMessage('OK', 'Nuovo incasso registrato');
		} else {
			_result = addNewMessage('ERROR', 'Impossibile registrare incasso');
		}
		_result && setBuyngList([]);
	};

	//Show other data----------------------------------------------------------------

	const [showSettings, setShowSettings] = useState(false);
	const [showTotals, setShowTotals] = useState(false);

	const showSettingsHandler = () => {
		setShowSettings(!showSettings);
	};

	const openSettings = () => {
		const formPayment = <Settings clear={showSettingsHandler} />;

		return ReactDOM.createPortal(
			formPayment,
			document.getElementById('overData')
		);
	};

	return (
		<React.Fragment>
			{showSettings && openSettings()}
			<div className={classes.main}>
				<PopupBoard
					messages={messages}
					removeMessage={removeMessage}
					addNewMessage={addNewMessage}
				/>
				<div className={classes.content}>
					<div className={classes.menu}>
						<img
							src={iconSettings}
							className={classes.icons}
							onClick={showSettingsHandler}
						/>
						<img src={iconChart} className={classes.icons} />
					</div>
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
		</React.Fragment>
	);
}

export default App;
/**
 * //TODO: Registrare [articolo, quantità, prezzo, data/ora]
 * //TODO: Creare pagina setup articoli
 * 		//TODO: Salvare impostazioni in locla storage, prevedere uso DB esterno
 *
 * //TODO: Crerare pagina statistiche
 * 		//TODO: Salvare statisticbe in local storage, prevedere uso DB esterno
 *
 */
