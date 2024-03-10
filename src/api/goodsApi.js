import axios from 'axios';
import crypto from 'crypto-js';

export const getGoods = async (goodsData, limit, offset) => {
	const url = 'https://api.valantis.store:41000/';

	const password = 'Valantis';

	const timestamp = new Date().toISOString().slice(0, 10).split('-').join('');

	const authData = `${password}_${timestamp}`;

	const authString = crypto.MD5(authData).toString();

	const requestBody = {
		action: 'get_items',
		params: { ids: goodsData, limit: limit, offset: offset },
	};

	let retryCount = 0;

	while (retryCount < 3) {
		try {
			const response = await axios.post(url, requestBody, {
				headers: {
					'Content-Type': 'application/json',
					'X-Auth': authString,
				},
			});

			if (response.status === 200) {
				return response.data;
			} else {
				retryCount++;
			}
		} catch (error) {
			console.error(error);
			retryCount++;
		}
	}

	throw new Error('Exceeded retry limit');
};
