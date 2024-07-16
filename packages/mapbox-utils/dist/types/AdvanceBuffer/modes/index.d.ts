import Mode, { FeatureType, createLine } from './mode';
export { Mode, createLine };
export type { FeatureType };
export declare const MODE_TYPE: {
    readonly NONE: "NONE";
    readonly POINT: "POINT";
    readonly LINE: "LINE";
    readonly POLYGON: "POLYGON";
    readonly RECT: "RECT";
};
export declare const MODE_MAP: {
    [key in Exclude<ModeType, typeof MODE_TYPE.NONE>]: new () => Mode;
};
export type ModeType = (typeof MODE_TYPE)[keyof typeof MODE_TYPE];
