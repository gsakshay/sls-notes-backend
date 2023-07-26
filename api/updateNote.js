/**
 * Route: PUT /note
 *
 * @format
 */

import AWS from "aws-sdk"
AWS.config.update({
	region: "us-east-2",
})

import { getResponseHeaders } from "./utils"

const dynamoDB = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

import moment from "moment"

exports.handler = async (event) => {
	try {
		let item = JSON.parse(event.body).Item
		item.user_id = getUserID(event.headers)
		item.user_name = getUserName(event.headers)
		item.expires = moment().add(90, "days").unix()
		// PUT class of DynamoDB
		let data = await dynamoDB
			.put({
				TableName: tableName,
				Item: item,
				ConditionExpression: "#t = :t",
				ExpressionAttributeNames: {
					"#t": "timestamp",
					":t": item.timestamp,
				},
			})
			.promise()
		return {
			statusCode: 200,
			headers: getResponseHeaders(),
			body: JSON.stringify(item),
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
