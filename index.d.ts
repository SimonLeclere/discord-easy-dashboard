import { Client as DiscordClient, Guild } from "discord.js";
import EventEmitter from "events";
export default Dashboard;
export { Options };

declare type Client = DiscordClient & { [key: string]: any };

declare class Dashboard extends EventEmitter {
    constructor(client: Client, options: Options);
    config: Config;
    registerCommand(name: string, description: string, usage: string): void;
    addTextInput(
        name: string,
        description: string,
        validator: (value: any) => boolean,
        setter: (client: Client, guild: Guild, value: string) => void,
        getter: (client: Client, guild: Guild) => string | Promise<string>
    ): void;
    addBooleanInput(
        name: string,
        description: string,
        setter: (client: Client, guild: Guild, value: boolean) => void,
        getter: (client: Client, guild: Guild) => boolean | Promise<boolean>
    ): void;
    addSelector(
        name: string,
        description: string,
        getSelectorEntries: (
            client: Client,
            guild: Guild
        ) => [string, string][] | Promise<[string, string][]>,
        setter: (client: Client, guild: Guild, value: boolean) => void,
        getter: (client: Client, guild: Guild) => boolean | Promise<boolean>
    ): void;

    addColorInput(
        name: string,
        description: string,
        setter: (client: Client, guild: Guild, value: string) => void,
        getter: (client: Client, guild: Guild) => string | Promise<string>
    ): void;
}

declare interface Options {
    name?: string;
    description?: string;
    serverUrl?: string;
    inviteUrl?: string;
    baseUrl?: string;
    port?: number;
    secret: string;
    logRequests?: boolean;
    injectCSS?: string;
    faviconPath?: string;
}

declare interface Config {
    baseUrl: string;
    port: number;
    noPortIncallbackUrl: boolean;
    secret: string;
    logRequests: boolean;
}
