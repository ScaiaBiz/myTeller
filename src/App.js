import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import classes from './App.module.css';

import PopupBoard from './kommon/popup/PopupBoard';
import ButtonsBoard from './comps/ButtonsBoard';
import Recap from './comps/Recap';

import Settings from './comps/Settings';

import iconSettings from './assets/settings_48.png';
import iconChart from './assets/chart_48.png';
import Analytics from './comps/Analytics';

function App() {
	//PopupMessage ---------------------------------------------
	// const { removeMessage, messages, addNewMessage } = usePopupMes();

	//fixme: Meglio ma non meglissimo verificare come gestire con un hook o con useReducer

	const [messages, setMessages] = useState([]);
	const [count, setCount] = useState(1);
	const [showButtons, setShowButtons] = useState(false);
	const [loadData, setLoadData] = useState(false);

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

	const endOrder = (post, cash) => {
		let _result;
		if (post === true) {
			const prevMovements = JSON.parse(
				window.localStorage.getItem('myTellerMovments')
			);
			const newMovement = {
				products: buyngList,
				datetime: new Date(),
				earn: cash,
			};
			let finalMovements;
			if (prevMovements) {
				finalMovements = [...prevMovements, newMovement];
			} else {
				finalMovements = [newMovement];
			}
			window.localStorage.setItem(
				'myTellerMovments',
				JSON.stringify(finalMovements)
			);
			updateTotalEarn(cash);
			updateTotalQty(buyngList);
			_result = addNewMessage('OK', 'Nuovo incasso registrato');
		} else {
			_result = addNewMessage('ERROR', 'Impossibile registrare incasso');
		}
		_result && setBuyngList([]);
	};

	const updateTotalQty = products => {
		console.log({ products });
		const prevTotQty = JSON.parse(
			window.localStorage.getItem('myTellerTotalQuantity')
		);
		let finalTotQty = {};
		if (prevTotQty) {
			finalTotQty = { ...prevTotQty };
		}
		console.log(finalTotQty);
		if (products.length == 0) {
			console.log('No products to register');
			return;
		}
		console.log('Product presenti');
		products.forEach(prod => {
			console.log({ prod });
			let target = prod.name + prod.prezzo;
			finalTotQty[target] = {};
			if (!finalTotQty[target].name) {
				finalTotQty[target].name = prod.name;
			}
			if (!finalTotQty[target].qty) {
				finalTotQty[target].qty = 0;
			}
			if (!finalTotQty[target].totEarn) {
				finalTotQty[target].totEarn = 0;
			}
			finalTotQty[target].qty =
				Number(finalTotQty[target].qty) + Number(prod.quantity);
			finalTotQty[target].price = Number(prod.prezzo);
			finalTotQty[target].totEarn =
				Number(finalTotQty[target].totEarn) +
				Number(prod.quantity * prod.prezzo);
		});
		window.localStorage.setItem(
			'myTellerTotalQuantity',
			JSON.stringify(finalTotQty)
		);
	};

	const updateTotalEarn = earn => {
		const prevTotal = JSON.parse(
			window.localStorage.getItem('myTellerTotalEarn')
		);
		let newTotal;
		if (!prevTotal) {
			newTotal = { euro: Number(earn) };
		} else {
			newTotal = prevTotal;
			newTotal.euro = Number(newTotal.euro) + Number(earn);
		}
		window.localStorage.setItem('myTellerTotalEarn', JSON.stringify(newTotal));
	};

	//Show other data----------------------------------------------------------------

	const [showSettings, setShowSettings] = useState(false);

	const showSettingsHandler = r => {
		console.log({ r });
		if (r === true) {
			setLoadData(true);
			addNewMessage('MESSAGE', 'Modifiche inserite');
		}
		setShowSettings(!showSettings);
	};

	const openSettings = () => {
		const formPayment = <Settings clear={showSettingsHandler} />;
		return ReactDOM.createPortal(
			formPayment,
			document.getElementById('overData')
		);
	};

	const [showAnalytics, setShowAnalytics] = useState(false);

	const showAnalyticsHandler = () => {
		setShowAnalytics(!showAnalytics);
	};

	const openAnalytics = () => {
		const analitycsPage = <Analytics clear={showAnalyticsHandler} />;
		return ReactDOM.createPortal(
			analitycsPage,
			document.getElementById('overData')
		);
	};

	//Handle reloading

	const showButtonsHandler = () => {
		setShowButtons(!showButtons);
		if (loadData) {
			setLoadData(false);
		}
	};

	useEffect(() => {
		console.log({ loadData });
		if (loadData) {
			showButtonsHandler();
		}
	}, [loadData]);

	useEffect(() => {
		console.log({ showButtons });
		if (!showButtons) {
			setLoadData(true);
		}
	}, [showButtons]);

	return (
		<React.Fragment>
			{showSettings && openSettings()}
			{showAnalytics && openAnalytics()}
			{/* <div onClick={() => updateTotalQty(buyngList)}>Test</div> */}
			{/* <div onClick={() => endOrder(true, 50)}>Test</div> */}

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
						<img
							src={iconChart}
							className={classes.icons}
							onClick={showAnalyticsHandler}
						/>
					</div>
					{showButtons && <ButtonsBoard add={addToList} />}
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
