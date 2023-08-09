import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';

import classes from './Main.module.css';

import { UserCxt } from '../../cxt/ctxUser';

import PopupBoard from '../../kommon/popup/PopupBoard';
import ButtonsBoard from '../../comps/Main/ButtonsBoard';
import Recap from '../../comps/Main/Recap';
import Button from '../../kommon/Button';

import Account from '../Account/Account';

import Settings from '../../comps/Settings/Settings';

import iconSettings from '../../assets/settings_48.png';
import iconChart from '../../assets/chart_48.png';
import Analytics from '../../comps/Analytics/Analytics';

function Main({ children }) {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useContext(UserCxt).user;
	const [company, setCompany] = useContext(UserCxt).company;
	const [event, setEvent] = useContext(UserCxt).event;
	const [forceUserLogout, setForceUserLogout] =
		useContext(UserCxt).handleUserLogout;

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

	const removeFromList = element => {
		const newList = buyngList.filter(el => {
			if (el._id != element) {
				return true;
			}
		});
		setBuyngList(newList);
	};

	const changePrintFormat = element => {
		const newList = buyngList.map(el => {
			if (el._id != element) {
				el.type = 'card';
				return el;
			} else {
				return el;
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
			let target = prod.name + prod.price;
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
			finalTotQty[target].price = Number(prod.price);
			finalTotQty[target].totEarn =
				Number(finalTotQty[target].totEarn) +
				Number(prod.quantity * prod.price);
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

	//----------------------------------------------------------------
	// Show other data
	//----------------------------------------------------------------

	const [showSettings, setShowSettings] = useState(false);

	const showSettingsHandler = r => {
		// console.log({ r });
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

	const [showProfile, setShowProfile] = useState(false);

	const showProfileHandler = () => {
		setShowProfile(!showProfile);
	};

	const openProfile = () => {
		const profilePage = <Account clear={showProfileHandler} />;

		return ReactDOM.createPortal(
			profilePage,
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
		if (loadData) {
			showButtonsHandler();
		}
	}, [loadData]);

	useEffect(() => {
		if (!showButtons) {
			setLoadData(true);
		}
	}, [showButtons]);

	return (
		<React.Fragment>
			{showSettings && openSettings()}
			{showAnalytics && openAnalytics()}
			{showProfile && openProfile()}

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
							onClick={(user.isAdmn || user.level) && showSettingsHandler}
							style={
								!(user.isAdmn || user.level) ? { visibility: 'hidden' } : {}
							}
						/>

						{/* <Account /> */}
						<Button
							value={`${user.name}`}
							clname={'confirm'}
							action={showProfileHandler}
						/>
						<img
							src={iconChart}
							className={classes.icons}
							onClick={(user.isAdmn || user.level) && showAnalyticsHandler}
							style={
								!(user.isAdmn || user.level) ? { visibility: 'hidden' } : {}
							}
						/>
					</div>
					{showButtons && event && company && (
						<ButtonsBoard add={addToList} event={event} />
					)}
				</div>
				<div className={classes.recap}>
					<Recap
						list={buyngList}
						setBuyngList={setBuyngList}
						removeElement={removeFromList}
						changePrintFormat={changePrintFormat}
						endOrder={endOrder}
						addNewMessage={addNewMessage}
					/>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Main;
/**
 * //TODO: Registrare [articolo, quantità, prezzo, data/ora]
 * //TODO: Creare pagina setup articoli
 * 		//TODO: Salvare impostazioni in locla storage, prevedere uso DB esterno
 *
 * //TODO: Crerare pagina statistiche
 * 		//TODO: Salvare statisticbe in local storage, prevedere uso DB esterno
 *
 */
