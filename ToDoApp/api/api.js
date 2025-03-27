import axios from 'axios';

export const api = axios.create({
	baseURL: import.meta.env.BACKEND_API_URL,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${localStorage.getItem('token')}`,
	},
});

export const cloudinaryApi = axios.create({
	baseURL: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`,
});
