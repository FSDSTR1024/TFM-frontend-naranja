import { cloudinaryApi } from './api';

export const CloudinaryAPI = {
	uploadImage: async (file) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

		const response = await cloudinaryApi.post('/image/upload', formData);
		return response.data.secure_url;
	},
};
