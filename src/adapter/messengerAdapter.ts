import { GenericAdapter, User } from 'ebony-framework';
import webhook from './webhook';
import { Request, Response, RequestHandler } from 'express';
import { senderFactory } from './sender';
import messagingWebhook from '../webhooks/messaging';
import MessengerUser from './MessengerUser';
import { UserDataFields } from './interfaces/messengerAPI';

export interface MessengerWebhookOptions {
    webhookKey?: string;
    route?: string;
    pageId: string;
    appSecret: string;
    pageToken: string;
    userModel?: (new <T extends MessengerUser>(...params: any) => T) | (new (...params: any) => MessengerUser)
}

export default class MessengerAdapter extends GenericAdapter {
    private webhookKey: string;
    private appSecret: string;
    private pageToken: string;
    private route: string;
    private pageId: string;

    constructor(options: MessengerWebhookOptions) {
        super();

        const { route = '/fb', webhookKey = 'ebony123', pageId, pageToken, appSecret, userModel = MessengerUser } = options;

        this.webhookKey = webhookKey;
        this.appSecret = appSecret;
        this.pageToken = pageToken;
        this.pageId = pageId;
        this.route = route;

        this.userModel = userModel;

    }

    initWebhook() {
        const messaging = messagingWebhook({ userLoader: MessengerUser.userLoader(this.pageToken), routers: this.routers });

        // Facebook specific endpoints
        this.webhook.get(this.route, this.validationEndpoint());
        this.webhook.post(this.route, webhook(this.pageId, { messaging }));
    }

    private validationEndpoint(): RequestHandler {
        const webhookKey = this.webhookKey;

        return (req: Request, res: Response) => {
            if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === webhookKey) {
                console.log("Validating webhook");
                return res.status(200).send(req.query['hub.challenge']);
            }

            console.error("Failed validation. Make sure the validation tokens match.");
            return res.sendStatus(400);
        }
    }

    public sender() {
        const pageToken = this.pageToken;
        const { send } = senderFactory(pageToken);

        return send;
    }

    public startsTyping() {
        const pageToken = this.pageToken;
        const { senderAction } = senderFactory(pageToken);

        return (id: string) => senderAction(id, "typing_on");
    }

    public stopsTyping() {
        const pageToken = this.pageToken;
        const { senderAction } = senderFactory(pageToken);

        return (id: string) => senderAction(id, "typing_on");
    }

    public markSeen() {
        const pageToken = this.pageToken;
        const { senderAction } = senderFactory(pageToken);

        return (id: string) => senderAction(id, "mark_seen");
    }

    public getUserData() {
        const pageToken = this.pageToken;
        const { getUserData } = senderFactory(pageToken);

        return getUserData;
    }

}

