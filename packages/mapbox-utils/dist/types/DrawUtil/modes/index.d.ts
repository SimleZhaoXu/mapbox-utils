import Mode, { FeatureType } from './mode';
export { Mode };
export type { FeatureType };
export declare const MODE_TYPE: {
    readonly NONE: "NONE";
    readonly DRAW_POINT: "DRAW_POINT";
    readonly DRAW_LINE: "DRAW_LINE";
    readonly DRAW_POLYGON: "DRAW_POLYGON";
    readonly DRAW_CIRCLE: "DRAW_CIRCLE";
    readonly DRAW_RECT: "DRAW_RECT";
};
export declare const MODE_MAP: {
    [key in Exclude<ModeType, typeof MODE_TYPE.NONE>]: new () => Mode;
};
export type ModeType = (typeof MODE_TYPE)[keyof typeof MODE_TYPE];
