import { Router } from 'express';

interface EbonyHandlers {
    [key: string]: (...params: any) => any;
}

type ContextLoader = any;

export default class GenericAdapter {
    public webhook: Router;
    protected handlers: EbonyHandlers;
    protected contextLoader: (id: string) => Promise<any>;

    constructor(contextLoader: ContextLoader) {
        this.webhook = Router();
        this.handlers = {};
        this.contextLoader = contextLoader
    }
}

