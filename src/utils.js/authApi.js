export const BASE_URL = 'https://auth.nomoreparties.co'

const checkResponse = (res) => {
	if (res.ok) {
		return res.json();
	} 
	return Promise.reject(`checkResponse - ошибка: ${res.status}`);
	}

export const registration = ({ email, password }) => {
	return fetch(`${BASE_URL}/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ password, email }),
	})
	.then(checkResponse);
}


export const authorization = ({ email, password }) => {
	return fetch(`${BASE_URL}/signin`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ password, email }),
	})
	.then(checkResponse);
}

export const getContent = (token) => {
	return fetch(`${BASE_URL}/users/me`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
	})
	.then(checkResponse);
}