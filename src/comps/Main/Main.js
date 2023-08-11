import React, { useState, useEffect, useRef, useContext } from 'react';
import ReactDOM from 'react-dom';

import classes from './Main.module.css';

import { UserCxt } from '../../cxt/ctxUser';

import { useHttpClient } from '../../hooks/http-hooks';
import ErrorModal from '../../utils/ErrorModal';
import LoadingSpinner from '../../utils/LoadingSpinner';

import PopupBoard from '../../kommon/popup/PopupBoard';
import ButtonsBoard from '../../comps/Main/ButtonsBoard';
import Recap from '../../comps/Main/Recap';
import Button from '../../kommon/Button';

import Reprint from '../Reprint/Reprint';

import Account from '../Account/Account';

import Settings from '../../comps/Settings/Settings';

import iconSettings from '../../assets/settings_48.png';
import iconChart from '../../assets/chart_48.png';
import Analytics from '../../comps/Analytics/Analytics';

function Main() {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useContext(UserCxt).user;
	const [company, setCompany] = useContext(UserCxt).company;
	const [event, setEvent] = useContext(UserCxt).event;
	const [forceUserLogout, setForceUserLogout] =
		useContext(UserCxt).handleUserLogout;

	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	//PopupMessage ---------------------------------------------
	// const { removeMessage, messages, addNewMessage } = usePopupMes();

	//fixme: Meglio ma non meglissimo verificare come gestire con un hook o con useReducer

	const [messages, setMessages] = useState([]);
	const [count, setCount] = useState(1);
	const [showButtons, setShowButtons] = useState(false);
	const [loadData, setLoadData] = useState(false);

	const [lastTransaction, setLastTransaction] = useState();

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
			listId: Number(buyngList.length) + 1,
			type: 'text',
		};
		setBuyngList([...buyngList, el]);
	};

	const removeFromList = element => {
		const newList = buyngList.filter(el => {
			if (el.listId != element) {
				return true;
			}
		});
		const reordered = newList.map((el, i) => {
			el.listId = i;
			return el;
		});
		setBuyngList(reordered);
	};

	const changePrintFormat = element => {
		const newList = buyngList.map((el, i) => {
			if (el.listId == element) {
				switch (el.type) {
					case 'card':
						el.type = 'text';
						break;
					case 'text':
						el.type = 'card';
						break;
				}
			}
			el.listId = i;
			return el;
		});
		setBuyngList(newList);
	};

	const endOrder = async (post, cash) => {
		let _result;
		if (post === true) {
			const date = new Date();

			const newMovement = {
				productsList: buyngList,
				datetime: date,
				date: date.toLocaleDateString('it-IT'),
				time: date.toLocaleTimeString('it-IT'),
				earn: cash,
				refUser: user._id,
				refEvent: event._id,
			};

			const resData = await sendRequest(
				'event/newTransaction',
				'POST',
				{
					eventId: event._id,
					transaction: newMovement,
					earn: cash,
				},
				{
					'Content-Type': 'application/json',
				}
			);

			setBuyngList([]);
			setEvent(resData.event);
			setLastTransaction(resData.transaction);
			_result = addNewMessage('OK', 'Nuovo incasso registrato');
		} else {
			_result = addNewMessage('ERROR', 'Impossibile registrare incasso');
		}
	};

	useEffect(() => {
		if (lastTransaction) {
			definePrintSchema();
		}
	}, [lastTransaction]);

	const definePrintSchema = (data = null) => {
		const products = data ? data : lastTransaction.productsList;
		let p_data = [];

		const maxL = 31;

		const ESC = '\u001B';
		const GS = '\u001D';
		const BoldOn = ESC + 'E' + '\u0001';
		const BoldOff = ESC + 'E' + '\0';
		const DoubleOn = GS + '!' + '\u0011'; // 2x sized text (double-high + double-wide)
		const DoubleOff = GS + '!' + '\0';

		const separator = `\n${centerText(
			`----------------------`,
			maxL,
			false
		)}\n`;
		const header_company = `${centerText(`${company.name}`, maxL, false)}\n`;
		const header_event = `${BoldOn}${centerText(
			`${event.name}`,
			maxL,
			false
		)}${BoldOff}\n\n`;
		const footer = '\n\n' + centerText(`Grazie e buon proseguimento!`, maxL);

		products.map(p => {
			let str = '';
			switch (p.type) {
				case 'text':
					str = `\n${DoubleOn}${centerText(
						`${p.name} X ${p.quantity}`,
						maxL,
						true
					)}${DoubleOff}\n`;

					p_data.push(str);
					break;
				case 'card':
					for (let i = 0; i < p.quantity; i++) {
						p_data.push(separator);
						p_data.push(header_company);
						p_data.push(header_event);
						p_data.push(
							`${DoubleOn}${centerText(`${p.name}`, maxL, true)}${DoubleOff}\n`
						);
						// p_data.push(footer);
					}
					break;

				default:
					break;
			}
		});
		p_data.unshift(header_event);
		p_data.unshift(header_company);
		p_data.push(footer);
		document.getElementById('pre_print').innerText = p_data.join('');
		printOrder(p_data.join(''));
	};

	const centerText = (str, maxL, double = false) => {
		if (double) {
			maxL = maxL / 2;
		}
		let length = str.length;
		if (length < maxL) {
			let residual = (maxL - length) / 2;
			for (let i = 0; i < residual; i++) {
				str = '\u0020' + str;
			}
		}
		return str;
	};

	const printOrder = id => {
		// const target = document.createElement('a');
		// let test = await sendRequest('print/transaction');
		// // target.href = `my.bluetoothprint.scheme://http://192.168.1.13:3110/print/transaction`;
		// target.href = `rawbt:data:text/palin;${test}`;
		// target.click();
		const S = '#Intent;scheme=rawbt;';
		const P = 'package=ru.a402d.rawbtprinter;end;';
		const textEncoded = encodeURI(id);
		window.location.href = 'intent:' + textEncoded + S + P;
	};

	//----------------------------------------------------------------
	// Reprint last Order
	//----------------------------------------------------------------

	const [showReprint, setShowReprint] = useState(false);

	const showReprintHandler = () => {
		setShowReprint(!showReprint);
	};

	const openReprintForm = () => {
		const reprint = (
			<Reprint
				list={lastTransaction}
				endOrder={definePrintSchema}
				clear={showReprintHandler}
			/>
		);
		return ReactDOM.createPortal(reprint, document.getElementById('overData'));
	};

	//----------------------------------------------------------------
	// Show other data
	//----------------------------------------------------------------

	const [showSettings, setShowSettings] = useState(false);

	const showSettingsHandler = r => {
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
		const analitycsPage = (
			<Analytics clear={showAnalyticsHandler} event={event} />
		);
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
			{error && <ErrorModal error={error} onClear={clearError} />}
			{isLoading && <LoadingSpinner asOverlay />}

			{showSettings && openSettings()}
			{showAnalytics && openAnalytics()}
			{showProfile && openProfile()}
			{showReprint && openReprintForm()}

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

						<div className={classes.profile}>
							<p>PROFILO</p>
							<Button
								value={`${user.name}`}
								clname={'confirm small'}
								action={showProfileHandler}
							/>
							<b>{company?.name}</b>
							<p>{event?.name}</p>
						</div>
						<img
							src={iconChart}
							className={classes.icons}
							onClick={(user.isAdmn || user.level) && showAnalyticsHandler}
							style={
								!(user.isAdmn || user.level) ? { visibility: 'hidden' } : {}
							}
						/>
					</div>
					{showButtons && event && company ? (
						<ButtonsBoard add={addToList} event={event} />
					) : (
						<p>Seleziona evento dalla schermata profilo</p>
					)}
					<pre id='pre_print' className={classes.prePrint}></pre>
					{/* <Button
						value={'Define'}
						action={definePrintSchema}
					/> */}
					{/* <Button
						value={'Print'}
						action={() =>
							printOrder(document.getElementById('pre_print').innerText)
						}
					/> */}
					{/* <Button
						value={'Ristampa ultimo'}
						action={showReprintHandler}
						disabled={lastTransaction.length == 0}
					/> */}
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
					<Button
						value={'Ristampa ultimo'}
						action={showReprintHandler}
						disabled={!lastTransaction}
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
