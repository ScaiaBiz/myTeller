import React, { useState, useEffect, useRef, useContext } from 'react';

import { UserCxt } from './cxt/ctxUser';

import classes from './App.module.css';

import Login from './comps/Login/Login';
import Main from './comps/Main/Main';

function App() {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useState(JSON.parse(localStorage.getItem(LS_Area)));
	const [forceUserLogout, setForceUserLogout] = useState(false);
	const [company, setCompany] = useState(null);
	const [event, setEvent] = useState(null);

	const userCtxValue = {
		user: [user, setUser],
		LS_Area: LS_Area,
		handleUserLogout: [forceUserLogout, setForceUserLogout],

		company: [company, setCompany],
		event: [event, setEvent],
	};

	if (!user) {
		return (
			<UserCxt.Provider value={{ ...userCtxValue }}>
				<Login />
			</UserCxt.Provider>
		);
	} else {
		return (
			<UserCxt.Provider value={{ ...userCtxValue }}>
				<React.Fragment>
					<Main />
					{/* <Login /> */}
					{/* </Main> */}
				</React.Fragment>
			</UserCxt.Provider>
		);
	}
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
