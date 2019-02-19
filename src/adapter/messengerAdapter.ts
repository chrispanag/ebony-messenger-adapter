import GenericAdapter from './adapter';
import webhook from './webhook';
import { Request, Response, RequestHandler } from 'express';

type ContextLoader = any;

export interface MessengerWebhookOptions {
    webhookKey?: string;
    route?: string;
    pageId: string;
    appSecret: string;
    pageToken: string;
}

export default class MessengerAdapter extends GenericAdapter {
    private webhookKey: string;
    private appSecret: string;
    private pageToken: string;

    constructor(contextLoader: ContextLoader, options: MessengerWebhookOptions) {
        super(contextLoader);

        const { route = '/fb', webhookKey = 'ebony123', pageId, pageToken, appSecret } = options;

        this.webhookKey = webhookKey;
        this.appSecret = appSecret;
        this.pageToken = pageToken;

        // Facebook specific endpoints
        this.webhook.get(route, this.validationEndpoint());
        this.webhook.post(route, webhook(pageId));
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
        // TODO: Implement Sender
        const pageToken = this.pageToken;
        
        return (id: string, message: any, options: any) => {
            console.log(message);
            return Promise.resolve();
        }
    }

    public startsTyping() {
        // TODO: Implement typing
        const pageToken = this.pageToken;

        return (id: string) => {
            console.log("Typing...");
            return Promise.resolve();
        }
    }

}