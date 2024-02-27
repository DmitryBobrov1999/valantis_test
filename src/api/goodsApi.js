import crypto from 'crypto-js';

const url = 'http://api.valantis.store:40000/';

const password = 'Valantis';

const timestamp = new Date().toISOString().slice(0, 10).split('-').join('');

const authData = `${password}_${timestamp}`;

const authString = crypto.MD5(authData).toString();

const requestBody = {
	action: 'get_ids',
};

export const getGoods = async () => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Auth': authString,
		},
		body: JSON.stringify(requestBody),
	})
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error('Request failed');
		})
		.then(data => {
			console.log(data.result);
		})
		.catch(error => {
			console.error(error);
		});
	return response;
};
