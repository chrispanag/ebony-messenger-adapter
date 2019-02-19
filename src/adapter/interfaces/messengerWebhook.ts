export interface MessengerWebhookBody {
    object: string;
    entry: FacebookWebhookEntry[]
}

export interface FacebookWebhookEntry {
    id: string;
    time: number;

    messaging?: MessagingEntry[];
    changes?: any[];
    standby?: any[];
}

export interface MessagingEntry {
    sender: {
        id: string;
    };

    recipient: {
        id: string;
    };

    message?: Message;
    delivery?: Delivery;
    referral?: Referral;
    postback?: Postback;
    standby?: Standby;
    pass_thread_control?: PassThreadControl;
    take_thread_control?: TakeThreadControl;
    request_thread_control?: RequestThreadControl;
    app_roles?: AppRoles;
}

interface Message {
    mid: string;
    text: string;

    attachments?: {
        type: string;
        payload: any;
    };


    quick_reply?: {
        payload: string;
    };
}

interface Postback {
    title: string;
    payload?: string;
    referral?: Referral;
}

interface Referral {
    ref?: string;
    source: string
    type: string;
    referer_uri?: string;
    ad_id?: string;
}

// TODO: Add it
interface Standby {

}

interface Delivery {
    mids?: string[];
    watermark: number;
    seq?: number;
}

interface PassThreadControl {
    new_owner_app_id: string;
    metadata: string;
}

interface TakeThreadControl {
    previous_owner_app_id: string;
    metadata: string;
}

interface RequestThreadControl {
    requested_owner_app_id: string;
    metadata: string;
}

interface AppRoles {
    [key: string]: string[]
}