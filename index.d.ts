import { Plugin } from "webpack";
import { Options as TslintOptions } from "tslint/lib/runner";

export = TslintWebpackPlugin;

declare class TslintWebpackPlugin extends Plugin {
    constructor(options?: TslintWebpackPlugin.Options);
}

declare namespace TslintWebpackPlugin {
    // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/9f4c75126167d0d8af759f58405d53d983e94ad0/types/react-redux/index.d.ts#L33-L34
    type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
    type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

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
