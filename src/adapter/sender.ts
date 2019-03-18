/**
 * ebony-framework
 * 
 * @module sendAPI/sender 
 * @author Christos Panagiotakopoulos <chrispanag@gmail.com>
 * @copyright Copyright(c) 2018 Christos Panagiotakopoulos
 * @license MIT
 * 
 */

import { Message } from "../sendAPI/message";
import { SendAPIBody, UserDataFields } from "./interfaces/messengerAPI";
import { MessagingOptions } from "../sendAPI/interfaces";
import fetch from 'node-fetch';

/**
* @typedef {object} MessagingOptions
* @property {?string} tag - The messaging tag used to send the message
* @property {?string} notification_type - The notification type of the message
* @property {?type} type - The type of the message
*/

/**
 * Creates a sender function
 */
export function senderFactory(pageToken: string) {

    const qs = `access_token=${encodeURIComponent(pageToken)}`;

    /**
     * Sends a message to the user with the id
     * @param {!string} id - The id of the user
     * @param {!Message} message - The message to be sent
     * @param {?MessagingOptions} options - The sending options (OPTIONAL)
     * @returns {Promise} - Returns a promise
     */
    function send(id: string, message: Message, options: MessagingOptions = {}) {
        const { tag = null, notification_type = "REGULAR", type = "RESPONSE" } = options;

        if (!id)
            throw new Error("[Error] Send: No user id is specified!");

        if (!message)
            throw new Error("[Error] No message passed!");

        let messaging_type = type;
        if (tag)
            messaging_type = "MESSAGE_TAG";

        const body = {
            recipient: { id },
            message: message.serialize(),
            notification_type,
            messaging_type
        };

        // TODO implement logger in here.
        return sendAPI(body, qs);
    }

    function senderAction(id: string, action: string) {
        const body = {
            recipient: { id },
            sender_action: action
        }

        return sendAPI(body, qs);
    }

    function getUserData(id: string, fields: UserDataFields[]) {
        return getUserDataCall(id, fields, qs);
    }

    return {
        send,
        senderAction,
        getUserData
    };
}

async function sendAPI(body: SendAPIBody, qs: string) {
    try {
        const rsp = await fetch(`https://graph.facebook.com/me/messages?${qs}`, {
            body: JSON.stringify(body),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await rsp.json();

        if (json.error && json.error.message) {
            throw new Error(json.error.message);
        }

        return json;
    } catch (err) {
        // TODO: Handle errors
        throw err;
    }
}

async function getUserDataCall(id: string, fields: UserDataFields[], qs: string) {
    const query = fields.join(',');
    try {
        const rsp = await fetch(`https://graph.facebook.com/v2.11/${id}?fields=${query}&${qs}`);
        const json = await rsp.json();

        if (json.error && json.error.message) {
            throw new Error(json.error.message);
        }

        return json;
    } catch (err) {
        // TODO: Handle errors
        throw err;
    }
}