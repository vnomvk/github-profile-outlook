import axios from 'axios';

const getRequest = async (queryparams) => {
	const { url } = queryparams;
	try {
		return await axios.get(url);
	} catch (error) {
		// Default: status code 400 is indicates that user sending a bad request.
		const errorResponse = {
			status: (error && error.response && error.response.status) || '400',
			message: (error && error.response && error.response.data && error.response.data.message) || ''
		}
		return ('Error | Method: getRequest: ', errorResponse);
	}
}

export { getRequest };
