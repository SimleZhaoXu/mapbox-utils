import mapboxgl from 'mapbox-gl';
import { LayerType } from './layers';
import { ModeType, FeatureType } from './modes';
type EventType = 'add';
type EventData = {
    add: {
        data: {
            id: string;
            feature: FeatureType;
        };
    };
};
type Event<T extends EventType> = EventData[T] & {
    type: T;
};
type Options = {
    multiple?: boolean;
    layers?: Array<LayerType>;
};
export default class DrawUtil extends mapboxgl.Evented {
    private _map;
    private _source;
    private _cacheMap;
    private _currentMode;
    private _currentModeType;
    private _multiple;
    private _layers;
    static MODE_TYPE: {
        readonly NONE: "NONE";
        readonly DRAW_POINT: "DRAW_POINT";
        readonly DRAW_LINE: "DRAW_LINE";
        readonly DRAW_POLYGON: "DRAW_POLYGON";
        readonly DRAW_CIRCLE: "DRAW_CIRCLE";
        readonly DRAW_RECT: "DRAW_RECT";
    };
    constructor(options?: Options);
    get source(): string;
    get modeType(): ModeType;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    changeMode(mode: ModeType): this;
    clear(): this;
    add(geojson: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Point | GeoJSON.MultiPoint>, isCircle?: boolean): string;
    deleteById(id: string): this;
    getAll(): {
        id: string;
        feature: FeatureType;
    }[];
    on<T extends EventType>(type: T, listener: (e: Event<T>) => void): this;
    fire<T extends EventType>(type: T, properties?: EventData[T]): this;
    off<T extends EventType>(type?: T, listener?: (e: Event<T>) => void | undefined): this;
    private _handleEventListener;
    private _onData;
    private _OnDblClick;
    private _onMousemove;
    private _onClick;
    private _render;
    private _addSourceAnyLayer;
    private _removeSourceAndLayer;
}
export {};
