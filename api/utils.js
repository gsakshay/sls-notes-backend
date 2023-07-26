/** @format */

export const getResponseHeaders = () => {
	return {
		"Access-Control-Allow-Origin": "*",
	}
}

export const getUserID = (requestHeaders) => {
	return requestHeaders.app_user_id
}

export const getUserName = (requestHeaders) => {
	return requestHeaders.app_user_name
}
