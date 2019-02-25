import { MessagingEntry } from "../adapter/interfaces/messengerWebhook";
import { IRouters } from "ebony-framework/build/adapter"
import MessengerUser from "../adapter/MessengerUser";

interface MessagingWebhookOptions {
    routers: IRouters;
    userLoader: (id: string) => Promise<MessengerUser>;
}

export default function messagingWebhook({ userLoader, routers }: MessagingWebhookOptions) {
    return async (e: MessagingEntry) => {
        const user = await userLoader(e.sender.id);
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
                routerExists(routers.PostbackRouter).stringPayloadHandler(e, e.postback.payload, user);
                return;
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

function routerExists<T>(router: T | undefined): T | never {
    if (typeof router === 'undefined') {
        throw new Error("Router is undefined");
    }

    return router;
}