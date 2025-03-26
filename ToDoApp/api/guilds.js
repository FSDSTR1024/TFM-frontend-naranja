import { api } from './api.js';

export const GuildsAPI = {
	async registerGuild(guildname, id) {
		const response = await api.post('/user/guilds/registerGuild', { guildname, userIds: [id] });
		return response;
	},

	async registerUserInGuild(guildname, id) {
		const response = await api.patch('/user/guilds/registerUserInGuild', { guildname, id });
		return response;
	},

	async getSearchedGuild(guildname, saveGuildInStorage = false) {
		const response = await api.get(`/user/guilds/${guildname}`);
		if (saveGuildInStorage) localStorage.setItem('guild', JSON.stringify({ guildname: response.data.guildname, tilemap: response.data.tilemap, userIds: response.data.userIds, chat: response.data.chat }));
		return response;
	},

	async saveTileMap(guildname, tilemap) {
		const response = await api.put('/user/guilds/saveTileMap', { guildname, tilemap });
		localStorage.setItem('guild', JSON.stringify({ ...JSON.parse(localStorage.getItem('guild')), tilemap: response.data.tilemap }));
		return response;
	},

	async registerKingdomInGuild(guildname, id) {
		const response = await api.patch('/user/guilds/registerKingdomInGuild', { guildname, id });
		return response;
	},

	async deleteKingdomFromGuild(guildname, id) {
		const response = await api.patch('/user/guilds/deleteKingdomFromGuild', { guildname, id });
		return response;
	},
};
