import { useState, useEffect } from 'react';

export const usePopupMes = () => {
	const [messages, setMessages] = useState([]);

	const removeMessage = id => {
		const mes = messages.filter(m => {
			return id != m._id;
		});
		setMessages(mes);
	};

	const addNewMessage = async (type, text) => {
		const newMessage = {
			_id: Date.now(),
			type: type,
			text: text,
		};
		const mess = [newMessage, ...messages];
		setMessages(mess);
		return true;
	};

	return { addNewMessage, removeMessage, messages };
};
