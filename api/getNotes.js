/**
 * Route: GET /notes
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
		let query = event.queryStringParameters
		let limit = query && query.limit ? parseInt(query.limit) : 5
		let user_id = getUserID(event.headers)

		let params = {
			TableName: tableName,
			KeyConditionExpression: "user_id = :uid",
			ExpressionAttributeValues: {
				":uid": user_id,
			},
			limit: limit,
			ScanIndexForward: false,
		}

		let startTimeStamp = query && query.start ? parseInt(query.start) : 0

		if (startTimeStamp > 0) {
			parame.ExclusiveStartKey = {
				user_id: user_id,
				timestamp: startTimeStamp,
			}
		}

		let data = await dynamoDB.query(params).promise()

		return {
			statusCode: 200,
			headers: getResponseHeaders(),
			body: JSON.stringify(data),
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
