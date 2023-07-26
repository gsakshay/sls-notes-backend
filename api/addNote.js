/**
 * Route: POST /note
 *
 * @format
 */

import AWS from "aws-sdk"
AWS.config.update({
	region: "us-east-2",
})

import { getResponseHeaders, getUserID, getUserName } from "./utils"

import moment from "moment"
import uuidv4 from "uuid/v4"

const dynamoDB = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.NOTES_TABLE

exports.handler = async (event) => {
	try {
		let item = JSON.parse(event.body).Item
		item.user_id = getUserID(event.headers)
		item.user_name = getUserName(event.headers)
		item.note_id = item.user_id + ":" + uuidv4()
		item.timestamp = moment().unix()
		item.expires = moment().add(90, "days").unix()

		// PUT class of DynamoDB
		let data = await dynamoDB
			.put({
				TableName: tableName,
				Item: item,
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
