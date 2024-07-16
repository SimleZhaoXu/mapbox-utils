import mapboxgl from 'mapbox-gl';
export type FeatureType = GeoJSON.Feature<GeoJSON.Point> | GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString> | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
export default abstract class MODE extends mapboxgl.Evented {
    protected _next: number;
    protected _path: Array<[number, number]>;
    constructor();
    get next(): number;
    abstract clear(): void;
    abstract getFeatures(): {
        feature: FeatureType | null;
        renderFeatures: Array<FeatureType>;
    };
    abstract onClick(e: mapboxgl.MapMouseEvent): boolean;
    abstract onMouseMove(e: mapboxgl.MapMouseEvent): boolean;
    abstract onDblClick(e: mapboxgl.MapMouseEvent): void;
}
export declare function createLine(data: Array<[number, number]>, properties?: any): GeoJSON.Feature<GeoJSON.LineString> | null;
