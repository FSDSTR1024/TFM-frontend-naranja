import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { api } from '../../api/api.js';
import { io } from 'socket.io-client';

export const GlobalContext = React.createContext({
	socketRef: null,
	userInfo: null,
	guildInfo: null,
	membersInfo: null,
	kingdomsInfo: null,
	mute: false,
	volume: 0.5,
	setUserInfo: () => {},
	setGuildInfo: () => {},
	setMembersInfo: () => {},
	setKingdomsInfo: () => {},
	setMute: () => {},
	setVolume: () => {},
	logout: () => {},
	logOutGuild: () => {},
	userJoinToGuild: () => {},
	userRegisterInGuild: () => {},
});

export const GlobalProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);
	const [guildInfo, setGuildInfo] = useState(null);
	const [membersInfo, setMembersInfo] = useState([]);
	const [kingdomsInfo, setKingdomsInfo] = useState(null);
	const [loading, setLoading] = useState(true);
	const [mute, setMute] = useState(false);
	const [volume, setVolume] = useState(0.5);
	const socketRef = useRef(null);

	useEffect(() => {
		if (localStorage.getItem('user')) setUserInfo(JSON.parse(localStorage.getItem('user')));

		if (localStorage.getItem('guild')) setGuildInfo(JSON.parse(localStorage.getItem('guild')));

		if (localStorage.getItem('members')) setMembersInfo(JSON.parse(localStorage.getItem('members')));

		if (localStorage.getItem('kingdoms')) setKingdomsInfo(JSON.parse(localStorage.getItem('kingdoms')));

		const muted = localStorage.getItem('mute');
		if (muted === null) {
			localStorage.setItem('mute', JSON.stringify(false));
			setMute(false);
		} else {
			setMute(JSON.parse(muted));
		}

		const storedVolume = localStorage.getItem('volume');
		if (storedVolume === null) {
			localStorage.setItem('volume', 0.5);
			setVolume(0.5);
		} else {
			setVolume(storedVolume);
		}

		setUpSocket();

		setLoading(false);

		return () => {
			socketRef.current.off('newUser');
			socketRef.current.off('userJoined');
			socketRef.current.off('connectedMembers');
			socketRef.current.off('userLeft');
			socketRef.current.off('message');
		};
	}, []);

	// useEffect(() => {
	// 	if (guildInfo) {
	// 		setUpSocket();
	// 	}
	// }, [guildInfo]);

	const logout = () => {
		handleLogOut('user');
	};

	const logOutGuild = () => {
		handleLogOut('guild');
	};

	const handleLogOut = (logOutType) => {
		const guildname = guildInfo ? guildInfo.guildname : null;
		const userId = userInfo.id;

		switch (logOutType) {
			case 'guild':
				break;
			case 'user':
				setMute(false);
				setVolume(0.5);

				localStorage.removeItem('token');
				localStorage.removeItem('user');
				localStorage.removeItem('mute');
				localStorage.removeItem('volume');

				api.defaults.headers['Authorization'] = `Bearer undefined`;
				break;
		}

		// setGuildMessages([]);

		localStorage.removeItem('guild');
		localStorage.removeItem('members');
		// localStorage.removeItem('guildMessages');
		localStorage.removeItem('kingdoms');
		localStorage.removeItem('socket');

		if (userId && guildname) socketRef.current.emit('leaveGuild', guildname, userId);
	};

	const userRegisterInGuild = (guildname) => {
		socketRef.current.emit('userRegistered', guildname, userInfo.id, userInfo.username);
	};

	const setUpSocket = () => {
		socketRef.current = io(import.meta.env.VITE_BACKEND_API_URL);

		socketRef.current.on('newUser', (userId, username) => {
			setMembersInfo((prevMembers) => {
				const updatedMembers = [...prevMembers, { _id: userId, username: username, connect: false }];
				localStorage.setItem('members', JSON.stringify(updatedMembers));
				return updatedMembers;
			});
		});

		socketRef.current.on('userJoined', (userId) => {
			setMembersInfo((prevMembers) => {
				const updatedMembers = prevMembers.map((member) => {
					if (member._id === userId) member.connect = true;
					return member;
				});
				localStorage.setItem('members', JSON.stringify(updatedMembers));
				return updatedMembers;
			});
		});

		socketRef.current.on('connectedMembers', (membersInGuild) => {
			setMembersInfo((prevMembers) => {
				const updatedMembers = prevMembers.map((member) => {
					member.connect = false;
					if (membersInGuild.includes(member._id)) {
						member.connect = true;
					}
					return member;
				});
				localStorage.setItem('members', JSON.stringify(updatedMembers));
				return updatedMembers;
			});
		});

		socketRef.current.on('userLeft', (userId) => {
			setMembersInfo((prevMembers) => {
				const updatedMembers = prevMembers.map((member) => {
					if (member._id === userId) member.connect = false;
					return member;
				});
				localStorage.setItem('members', JSON.stringify(updatedMembers));
				return updatedMembers;
			});
		});

		socketRef.current.on('message', (message, profileImage) => {
			console.log('mensaje recibido', message, profileImage);
			setGuildInfo((prevGuild) => {
				const newChat = [...prevGuild.chat, { message, profileImage }];
				localStorage.setItem('guild', JSON.stringify({ ...prevGuild, chat: newChat }));
				return { ...prevGuild, chat: newChat };
			});
		});
	};

	const updateMembers = (updatedMembers) => {
		setMembersInfo(updatedMembers);
		localStorage.setItem('members', JSON.stringify(updatedMembers));
	};

	if (loading) return <></>;

	return <GlobalContext.Provider value={{ socketRef, userInfo, guildInfo, membersInfo, kingdomsInfo, mute, volume, setUserInfo, setGuildInfo, setMembersInfo, setKingdomsInfo, setMute, setVolume, logout, logOutGuild, updateMembers, userRegisterInGuild }}>{children}</GlobalContext.Provider>;
};
