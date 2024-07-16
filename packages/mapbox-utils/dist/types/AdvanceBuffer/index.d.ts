import mapboxgl from 'mapbox-gl';
import { LayerType } from './layers';
import { ModeType, FeatureType } from './modes';
type BufferFeatureType = GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
type EventType = 'add';
type EventData = {
    add: {
        data: {
            id: string;
            feature: FeatureType;
            bufferFeature: BufferFeatureType;
        };
    };
};
type Event<T extends EventType> = EventData[T] & {
    type: T;
};
declare const units: readonly ["meters", "kilometers"];
type Units = (typeof units)[number];
type Options = {
    multiple?: boolean;
    layers?: Array<LayerType>;
    radius?: number;
    units?: Units;
    steps?: number;
};
export default class AdvanceBuffer extends mapboxgl.Evented {
    private _map;
    private _source;
    private _cacheMap;
    private _currentMode;
    private _currentModeType;
    private _multiple;
    private _layers;
    private _radius;
    private _units;
    private _steps;
    static MODE_TYPE: {
        readonly NONE: "NONE";
        readonly POINT: "POINT";
        readonly LINE: "LINE";
        readonly POLYGON: "POLYGON";
        readonly RECT: "RECT";
    };
    constructor(options?: Options);
    get source(): string;
    get modeType(): ModeType;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    changeMode(mode: ModeType): this;
    clear(): this;
    add(feature: FeatureType): {
        id: string;
        feature: any;
        bufferFeature: any;
    };
    deleteById(id: string): this;
    getAll(): {
        id: string;
        feature: FeatureType;
        bufferFeature: BufferFeatureType;
    }[];
    setBufferOptions(options: {
        radius?: number;
        units?: Units;
        steps?: number;
    }): this;
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
