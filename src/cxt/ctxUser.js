import { createContext } from 'react';

export const UserCxt = createContext({
	user: null,
	handleUserLogout: null,
	LS_Area: 'myTeller_User',
	company: null,
	event: null,
});
