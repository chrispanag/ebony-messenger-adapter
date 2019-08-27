import { GenericAdapter, User } from 'ebony-framework';
import { UserModel } from 'ebony-framework/build/adapter'
import webhook from './webhook';
import { Request, Response, RequestHandler } from 'express';
import { senderFactory } from './sender';
import messagingWebhook from '../webhooks/messaging';
import MessengerUser from './MessengerUser';
import { UserDataFields } from './interfaces/messengerAPI';

export interface MessengerWebhookOptions<T> {
    webhookKey?: string;
    route?: string;
    pageId: string;
    appSecret: string;
    pageToken: string;
    userModel?: UserModel<T | MessengerUser>
}

export default class MessengerAdapter<T extends MessengerUser> extends GenericAdapter<T | MessengerUser> {
    private webhookKey: string;
    private appSecret: string;
    private pageToken: string;
    private route: string;
    private pageId: string;

    constructor(options: MessengerWebhookOptions<T>) {
        const { route = '/fb', webhookKey = 'ebony123', pageId, pageToken, appSecret, userModel = MessengerUser } = options;

        super('messenger', userModel);

        this.webhookKey = webhookKey;
        this.appSecret = appSecret;
        this.pageToken = pageToken;
        this.pageId = pageId;
        this.route = route;
    }

    initWebhook() {
        const messaging = messagingWebhook({ userLoader: this.userLoader(), routers: this.routers, handlers: this.handlers });

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

    get sender() {
        const pageToken = this.pageToken;
        const { send } = senderFactory(pageToken);

        return send;
    }

    get startsTyping() {
        const pageToken = this.pageToken;
        const { senderAction } = senderFactory(pageToken);

        return (id: string) => senderAction(id, "typing_on");
    }

    get stopsTyping() {
        const pageToken = this.pageToken;
        const { senderAction } = senderFactory(pageToken);

        return (id: string) => senderAction(id, "typing_on");
    }

    get markSeen() {
        const pageToken = this.pageToken;
        const { senderAction } = senderFactory(pageToken);

        return (id: string) => senderAction(id, "mark_seen");
    }

    get getUserData() {
        const pageToken = this.pageToken;
        const { getUserData } = senderFactory(pageToken);

        return getUserData;
    }

    get handover() {
        const pageToken = this.pageToken;
        const { handover } = senderFactory(pageToken);

        return handover;
    }

    public userLoader(): (id: string) => Promise<T> {
        return async (id: string) => {
            try {
                const userData = await User.findByProviderId(id);
                if (!userData) {
                    const newUser = new this.userModel({
                        id,
                        provider: this.providerName
                    }, this.pageToken) as T;
                    await newUser.getFacebookData();
                    await newUser.save();

                    return newUser;
                }
                
                return new MessengerUser(userData, this.pageToken) as T;
            } catch (err) {
                throw err;
            }
        }
    }

}

