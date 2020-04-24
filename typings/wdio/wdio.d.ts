
declare module WebdriverIO {

    // adding command to `browser`
    interface Browser {
        screenshotByElement: (a: string, b: string) => void
        addStr: (a: string, b: string) => void
    }
    interface Config {
        test_settings: {
            loginType?: "TestSSO" | "TLSsso" | "reachUCSTB" | "certificate" | "AndroidSTB" | "LiveID" | "SKTsso" | "CCXsso";
            [propName: string]: any;
        };
    }
}