import MODE, { FeatureType } from './mode';
export default class Point extends MODE {
    constructor();
    getFeatures(): {
        feature: import("@turf/turf").Feature<import("@turf/turf").Point, {
            origin: string;
        }>;
        renderFeatures: FeatureType[];
    };
    onClick(e: mapboxgl.MapMouseEvent): boolean;
    onMouseMove(): boolean;
    onDblClick(): void;
    clear(): void;
}
