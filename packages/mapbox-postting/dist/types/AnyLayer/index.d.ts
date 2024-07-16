import mapboxgl from 'mapbox-gl';
type LayerType = 'line' | 'circle' | 'symbol' | 'fill' | 'fill-extrusion';
interface Paint {
    line: mapboxgl.LinePaint;
    circle: mapboxgl.CirclePaint;
    symbol: mapboxgl.SymbolPaint;
    fill: mapboxgl.FillPaint;
    'fill-extrusion': mapboxgl.FillExtrusionPaint;
}
interface Layout {
    line: mapboxgl.LineLayout;
    circle: mapboxgl.CircleLayout;
    symbol: mapboxgl.SymbolLayout;
    fill: mapboxgl.FillLayout;
    'fill-extrusion': mapboxgl.FillExtrusionLayout;
}
interface Feature {
    line: GeoJSON.Feature<GeoJSON.LineString | GeoJSON.MultiLineString> | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    circle: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>;
    symbol: GeoJSON.Feature<GeoJSON.Point | GeoJSON.MultiPoint>;
    fill: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    'fill-extrusion': GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}
interface FeatureCollection {
    line: GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    circle: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>;
    symbol: GeoJSON.FeatureCollection<GeoJSON.Point | GeoJSON.MultiPoint>;
    fill: GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    'fill-extrusion': GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
}
type Data<T extends LayerType> = FeatureCollection[T] | Feature[T];
declare const cursors: readonly ["default", "crosshair", "pointer", "move", "e-resize", "ne-resize", "nw-resize", "n-resize", "se-resize", "sw-resize", "s-resize", "w-resize", "text", "wait", "help"];
interface Options<T extends LayerType> {
    id?: string;
    layerCursor?: (typeof cursors)[number];
    mapCursor?: (typeof cursors)[number];
    type: T;
    data?: Data<T>;
    paint?: Paint[T];
    layout?: Layout[T];
}
export default class AnyLayer<T extends LayerType> {
    private _id;
    private _data?;
    private _map?;
    private _type;
    private _layerId;
    private _paint?;
    private _layout?;
    private _layerCursor?;
    private _mapCursor?;
    constructor(options: Options<T>);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    setData(data: Data<T>): this;
    on(type: mapboxgl.MapMouseEvent['type'], callback: (e: mapboxgl.MapLayerMouseEvent) => void): this;
    off(type: mapboxgl.MapMouseEvent['type'], callback: (e: mapboxgl.MapLayerMouseEvent) => void): this;
    setStyle({ paint, layout }: {
        paint?: Paint[T];
        layout?: Layout[T];
    }): this;
    querySourceFeature(options: {
        filter?: any[];
        validate?: boolean;
    }): mapboxgl.MapboxGeoJSONFeature[];
    queryFeatureFormData(key: string, val: any): any;
    getSource(): mapboxgl.AnySourceImpl;
    private _addLayerAndSource;
    private _onMouseEnter;
    private _onMouseLeave;
    private _onData;
    private _removeLayerAndSource;
}
export {};
