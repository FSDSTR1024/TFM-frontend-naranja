import { api } from './api.js';

export const KingdomsAPI = {
	async registerKingdom(kingdomName, backgroundImage, hoverBackgroundImage) {
		const response = await api.post('/user/guilds/kingdoms/registerKingdom', { kingdomName, backgroundImage, hoverBackgroundImage });
		localStorage.setItem('kingdoms', JSON.stringify([...JSON.parse(localStorage.getItem('kingdoms')), response.data.kingdom]));
		return response;
	},

	async getKingdoms(kingdomsIds) {
		const response = await api.get(`/user/guilds/kingdoms/getKingdoms`, {
			params: { kingdomsIds },
		});
		localStorage.setItem('kingdoms', JSON.stringify(response.data.kingdoms));
		return response;
	},

	async updateKingdom(id, kingdomName, backgroundImage, hoverBackgroundImage) {
		const response = await api.patch('/user/guilds/kingdoms/updateKingdom', { id, kingdomName, backgroundImage, hoverBackgroundImage });
		const kingdoms = JSON.parse(localStorage.getItem('kingdoms'));
		const index = kingdoms.findIndex((kingdom) => kingdom._id === id);
		if (index !== -1) {
			kingdoms[index] = response.data.kingdom;
		}
		localStorage.setItem('kingdoms', JSON.stringify(kingdoms));
		return response;
	},

	async updateKingdomTasks(id, tasks) {
		const response = await api.patch('/user/guilds/kingdoms/updateKingdomTasks', { id, tasks });
		const kingdoms = JSON.parse(localStorage.getItem('kingdoms'));
		const index = kingdoms.findIndex((kingdom) => kingdom._id === id);
		if (index !== -1) {
			kingdoms[index] = response.data.kingdom;
		}
		localStorage.setItem('kingdoms', JSON.stringify(kingdoms));
		return response;
	},

	async updateKingdomTask(id, updatedTask) {
		const response = await api.patch('/user/guilds/kingdoms/updateKingdomTask', { id, updatedTask });
		const kingdoms = JSON.parse(localStorage.getItem('kingdoms'));
		const index = kingdoms.findIndex((kingdom) => kingdom._id === id);
		if (index !== -1) {
			kingdoms[index] = response.data.kingdom;
		}
		localStorage.setItem('kingdoms', JSON.stringify(kingdoms));
		return response;
	},

	async deleteKingdom(id) {
		const response = await api.delete('/user/guilds/kingdoms/deleteKingdom', { data: { id } });
		const kingdoms = JSON.parse(localStorage.getItem('kingdoms'));
		const index = kingdoms.findIndex((kingdom) => kingdom._id === id);
		if (index !== -1) {
			kingdoms.splice(index, 1);
		}
		localStorage.setItem('kingdoms', JSON.stringify(kingdoms));

		return { response, kingdoms };
	},
};
