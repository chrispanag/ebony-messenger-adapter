/**
 * ebony-framework
 * 
 * @module sendAPI 
 * @author Christos Panagiotakopoulos <chrispanag@gmail.com>
 * @copyright Copyright(c) 2018 Christos Panagiotakopoulos
 * @license MIT
 *
 */

import * as attachments from './attachments';
import * as buttons from './buttons';
import * as quickreplies from './quickreplies';
import * as templates from './templates';
import { senderFactory as sender } from './sender';
import { Message } from './message';

const elements = {
    ...buttons,
    ...attachments,
    ...quickreplies,
    ...templates
};

export {
    Message,
    sender,
    elements
}
