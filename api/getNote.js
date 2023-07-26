/**
 * Route: GET /note/n/{note_id}
 *
 * @format
 */

import AWS from "aws-sdk"
AWS.config.update({
	region: "us-east-2",
})

import { getResponseHeaders } from "./utils"
import _ from "underscore"

const dynamoDB = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

exports.handler = async (event) => {
	try {
		let note_id = decodeURIComponent(event.pathParameters.note_id)
		let params = {
			TableName: tableName,
			indexName: "note_id-index",
			KeyConditionExpression: "note_id = :note_id",
			ExpressionAttributeValues: {
				":note_id": note_id,
			},
			Limit: 1,
		}

		let data = await dynamoDB.query(params).promise()

		if (!_.isEmpty(data.Items)) {
			return {
				statusCode: 200,
				headers: getResponseHeaders(),
				body: JSON.stringify(data.Items[0]),
			}
		} else {
			return {
				statusCode: 404,
				headers: getResponseHeaders(x),
			}
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
