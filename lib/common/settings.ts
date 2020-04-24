export module settings {
    export interface INDVRConfig {
        cloud_scheduler_feature_group: string;
        recorder_id: string;
        dvr_channelmapgroup_id: string;
        offer_id: string;
        first_recording_duration_ms: number;
        second_recording_duration_ms: number;
        vspp_notification_delay_ms: number;
        real_recorder_id: string;
        shared_copy_channel_number: string;
    }
}

export const ratioTypeNumber = {
    Layout16x9: 0.56,
    Layout2x3: 1.5,
    Layout4x3: 0.75,
    Layout3x4: 1.33,
};

export function isRatioTolerable(actual: number, expected: number): boolean {
    console.log(`actual:${actual}, expected:${expected}`);
    const tolerable = 0.05;
    return Math.abs(actual - expected) / expected < tolerable;
}

export const shieldRunSettings = {
    RCAutomationToolHost: "tv3-agnt-0301.mr.ericsson.se",
    RCAutomationToolPort: 3000,
    RCAutomationToolAddress: "http://tv3-agnt-0301.mr.ericsson.se:3000",
    privateRunStr: "PrivateRun",
    privateBuildStr: "Private Build",
};

export const shieldTimeConfig = {
    FREE_NODE_QUERY_INTERVAL: 30000,
    UCSTB_RUN_INTERVAL: 90000,
    labQueueTimeout: 600000,
    labTestTimeout: 600000,
    deviceTestTimeout: 900000,
    MOCK_TEST_INTERVAL: 6000,
};

export const testResult = {
    pass: "PASSED",
    fail: "FAILED",
    timeout: "TIMED OUT",
};
