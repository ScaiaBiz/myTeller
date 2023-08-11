import React, { useState, useContext } from 'react';

import classes from './Account.module.css';

import { UserCxt } from '../../cxt/ctxUser';

import Button from '../../kommon/Button';
import Find from '../../utils/Inputs/Find';

import Login from '../Login/Login';

function Account({ clear }) {
	const LS_Area = useContext(UserCxt).LS_Area;
	const [user, setUser] = useContext(UserCxt).user;
	const [company, setCompany] = useContext(UserCxt).company;
	const [event, setEvent] = useContext(UserCxt).event;
	const [forceUserLogout, setForceUserLogout] =
		useContext(UserCxt).handleUserLogout;

	return (
		<React.Fragment>
			{/* {showAskEdit && activateAskEdit()} */}
			<div className={classes.wrapper}>
				<Login />
				<div>
					<Find
						url={`company/userCompanysList/${user._id}`}
						driver={'name'}
						inputId={'companySelector'}
						label={`Titolare dell'evento:`}
						initialValue={company?.name || ''}
						setRes={setCompany}
						resName={null}
						isArray={true}
						errorText={'none'}
					/>

					{company && (
						<Find
							url={`event/comapnyEventsList/${company?._id}`}
							driver={'name'}
							inputId={'eventSelector'}
							label={`Evento`}
							initialValue={event?.name || ''}
							setRes={setEvent}
							resName={null}
							isArray={true}
							errorText={'none'}
						/>
					)}
					{/* <Button value={'Crea nuovo evento'} /> */}
				</div>

				<Button value={'Chiudi'} clname={'danger'} action={clear} />
			</div>
		</React.Fragment>
	);
}

export default Account;
