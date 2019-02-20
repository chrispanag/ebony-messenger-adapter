import { FacebookWebhookEntry, MessagingEntry } from "../adapter/interfaces/messengerWebhook";
import PostbackRouter from 'ebony-framework/build/routers/PostbackRouter'
import MessengerUser from "../adapter/MessengerUser";

interface MessagingWebhookOptions {
    PostbackRouter?: PostbackRouter
    userLoader: (id: string) => Promise<MessengerUser>;
}

export default function messagingWebhook({ userLoader }: MessagingWebhookOptions) {
    return async (e: MessagingEntry) => {
        const user = await userLoader(e.sender.id);
        console.log(user);
        if (e.message) {
            if (e.message.text) {
                if (e.message.quick_reply) {
                    // TODO: Postbacks and text handler 
                    throw new Error("Not implemented");
                }
                // TODO: Text Handler
                throw new Error("Not implemented");
            }
            if (e.message.attachments) {
                // TODO: attachment handler
                throw new Error("Not implemented");
            }
            throw new Error("Not implemented");
        }
        if (e.postback) {
            if (e.postback.payload) {
                // TODO: Postback Handler
                throw new Error("Not implemented");
            }
            if (e.postback.referral) {
                // TODO: Referral handler
                throw new Error("Not implemented");
            }

            throw new Error("Not implemented");
        }
        if (e.referral) {
            // TODO: Referral handler
            throw new Error("Not implemented");
        }
        if (e.pass_thread_control) {
            throw new Error("Not implemented");
        }
        if (e.request_thread_control) {
            throw new Error("Not implemented");
        }
        if (e.take_thread_control) {
            throw new Error("Not implemented");
        }
        if (e.delivery) {
            throw new Error("Not implemented");
        }
        if (e.app_roles) {
            throw new Error("Not implemented");
        }
    }
}