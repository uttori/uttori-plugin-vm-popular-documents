declare module "vm-popular" {
    export = ViewModelPopularDocuments;
    class ViewModelPopularDocuments {
        static get configKey(): string;
        static defaultConfig(): object;
        static validateConfig(config: {
            configKey: {
                key: string;
                limit: string;
            };
        }, _context: object): void;
        static register(context: {
            config: {
                events: object;
            };
            hooks: {
                on: Function;
            };
        }): void;
        static callback(viewModel: object, context: {
            config: {
                key: string;
                limit: number;
                ignore_slugs: string[];
            };
            hooks: {
                on: Function;
                fetch: Function;
            };
        }): Promise<object>;
    }
}
declare module "index" {
    export const ViewModelPopularDocuments: typeof import("vm-popular");
}
