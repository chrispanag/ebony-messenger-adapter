import GenericAdapter from './adapter';
import webhook from './webhook';
import { Request, Response, RequestHandler } from 'express';

type ContextLoader = any;

export interface MessengerWebhookOptions {
    webhookKey?: string;
    route?: string;
    pageId: string;
}

export default class MessengerAdapter extends GenericAdapter {
    private webhookKey: string;

    constructor(contextLoader: ContextLoader, options: MessengerWebhookOptions) {
        super(contextLoader);

        const { route = '/fb', webhookKey = 'ebony123', pageId } = options;
        this.webhookKey = webhookKey;

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

}