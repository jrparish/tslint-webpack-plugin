import { Plugin } from "webpack";
import { Options as TslintOptions } from "tslint/lib/runner";

export = TslintWebpackPlugin;

declare class TslintWebpackPlugin extends Plugin {
    constructor(options?: TslintWebpackPlugin.Options);
}

declare namespace TslintWebpackPlugin {
    // Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
    export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

    type OmittedOptions = {
        files: string[];
        exclude: string[];
    }

    // tslint-webpack-plugin is more liberal with the options than tslint's runner is, thus tweak the interface
    interface Options extends Omit<TslintOptions, keyof OmittedOptions> {
        files: string | string[];
        exclude?: string[];
        silent?: boolean;
        warningsAsError?: boolean;
        waitForLinting?: boolean;
    }
}
