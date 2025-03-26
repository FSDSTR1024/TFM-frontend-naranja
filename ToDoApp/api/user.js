import { api } from './api.js';

export const UserAPI = {
	async login(userData) {
		const { email, password } = userData;
		const response = await api.post('/user/login', { email, password });
		localStorage.setItem(
			'user',
			JSON.stringify({ id: response.data.id, guilds: response.data.guilds, username: response.data.username, profileImage: response.data.profileImage ? response.data.profileImage : 'https://res.cloudinary.com/guild-tasks/image/upload/v1739385954/defaultProfileImage_vzujwf.png' })
		);
		saveToken(response.data.token);
		return response;
	},

	async signUp(userData) {
		const { username, email, password } = userData;
		const response = await api.post('/user/signUp', { username, email, password });
		return response;
	},

	async registerGuildInUser(guildname, id) {
		const response = await api.patch('/user/registerGuild', { guildname, id });
		localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), guilds: response.data.guilds }));
		return response;
	},

	async changeProfileImage(url, id) {
		const response = await api.patch('/user/changeProfileImage', { profileImage: url, id });
		localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), profileImage: response.data.profileImage }));
		return response;
	},

	async getMembersInfo(membersIds) {
		const response = await api.get(`/user/getMembersInfo/${membersIds}`);
		return response;
	},
};

function saveToken(token) {
	localStorage.setItem('token', token);
	api.defaults.headers['Authorization'] = `Bearer ${token}`;
}
