/**
 * ebony-framework
 * 
 * @module sendAPI/message
 * @author Christos Panagiotakopoulos <chrispanag@gmail.com>
 * @copyright Copyright(c) 2018 Christos Panagiotakopoulos
 * @license MIT
 * 
 */

import { QuickReply } from "./quickreplies";
import { Attachment } from "./attachments";

interface MessageOptions {
    text?: string | null, 
    quickreplies?: QuickReply[] | null,
    attachment?: Attachment | null,
    templateID?: string | null
}

/** Message Class */
export class Message {

    public text: string | null;
    public quickreplies: {}[] | null;
    public attachment: {} | null;
    public templateID: string | null;

    /**
     * Create a message
     * @param {MessageOptions|string} options - The message elements
    */
    constructor(options: MessageOptions = {}) {
        let { text = null, quickreplies = null, attachment = null, templateID = null } = options;

        if (!(typeof options === "object"))
            text = options, quickreplies = null, attachment = null, templateID = null;

        if (!(text || attachment))
            throw new Error("Message: No message content is specified!");
        if (text && attachment)
            throw new Error("Message: A message can't have text & attachment");

        this.text = text;

        this.quickreplies = quickreplies
        if (quickreplies)
            this.quickreplies = quickreplies.map(q => q.serialize());

        this.attachment = attachment;
        if (attachment)
            this.attachment = attachment.serialize();

        this.templateID = templateID;
    }
    
    serialize(): SerializedMessage {
        if (this.attachment) {
            return {
                attachment: this.attachment
            };
        }

        if (this.text) {
            return {
                text: this.text,
                quick_replies: this.quickreplies
            };
        }

        throw new Error("No text or Attachment");
    }

}

type SerializedMessage = SerializedAttachmentMessage | SerializedTextMessage;

interface SerializedAttachmentMessage {
    attachment: {}
};

interface SerializedTextMessage {
    text: string;
    quick_replies: {}[] | null;
}