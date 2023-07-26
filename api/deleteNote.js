/**
 * Route: DELETE /note/t/{timestamp}
 *
 * @format
 */

import AWS from "aws-sdk"
AWS.config.update({
	region: "us-east-2",
})

import { getResponseHeaders, getUserID } from "./utils"

const dynamoDB = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

exports.handler = async (event) => {
	try {
		let timestamp = parseInt(event.pathParameters.timestamp)
		let params = {
			TableName: tableName,
			Key: {
				user_id: getUserID(),
				timestamp: timestamp,
			},
		}

		let data = await dynamoDB.delete(params).promise()

		return {
			statusCode: 200,
			headers: getResponseHeaders(),
		}
	} catch (e) {
		console.log("Error", e)
		return {
			statusCode: e.statusCode ? e.statusCode : 500,
			headers: getResponseHeaders(),
			body: JSON.stringify({
				error: e.name ? e.name : "Exception",
				message: e.message ? e.message : "Unknown Error",
			}),
		}
	}
}
