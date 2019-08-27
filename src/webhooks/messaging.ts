import { MessagingEntry } from "../adapter/interfaces/messengerWebhook";
import { IRouters, EbonyHandlers } from "ebony-framework/build/adapter"
import MessengerUser from "../adapter/MessengerUser";

interface MessagingWebhookOptions {
    routers: IRouters;
    userLoader: (id: string) => Promise<MessengerUser>;
    handlers: EbonyHandlers;
}

export default function messagingWebhook({ userLoader, routers, handlers }: MessagingWebhookOptions): (e: MessagingEntry) => Promise<void> {
    return async (e: MessagingEntry) => {
        const user = await userLoader(e.sender.id);
        if (e.message) {
            if (e.message.text) {
                if (e.message.quick_reply) {
                    // TODO: Postbacks and text handler
                    const qr = e.message.quick_reply;
                    if (qr.payload) {
                        routerExists(routers.PostbackRouter).stringPayloadHandler(e, qr.payload, user);
                        return;
                    }
                    throw new Error("Not implemented");
                }
                // TODO: Improve dat
                if (handlers.text) {
                    handlers.text(e.message, e.message.nlp, user);
                } else {
                    throw new Error("No text handler!");
                }
                return;
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
                const referral = e.postback.referral;
                if (referral.ref) {
                    routerExists(routers.ReferralsRouter).referralsRouter(e, user, referral.ref);
                    return;
                }
                // TODO: Referral handler
                throw new Error("Not implemented");
            }

            throw new Error("Not implemented");
        }
        if (e.referral) {
            const referral = e.referral;
            if (referral.ref) {
                routerExists(routers.ReferralsRouter).referralsRouter(e, user, referral.ref);
                return;
            }
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