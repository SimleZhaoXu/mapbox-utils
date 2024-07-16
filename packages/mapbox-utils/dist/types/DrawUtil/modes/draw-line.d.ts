import MODE, { FeatureType } from './mode';
export default class DrawLine extends MODE {
    constructor();
    getFeatures(active?: 'true' | 'false'): {
        feature: import("geojson").Feature<import("geojson").LineString, {
            [name: string]: any;
        }>;
        renderFeatures: FeatureType[];
    };
    onClick(e: mapboxgl.MapMouseEvent): boolean;
    onMouseMove(e: mapboxgl.MapMouseEvent): boolean;
    onDblClick(e: mapboxgl.MapMouseEvent): void;
    clear(): void;
}
