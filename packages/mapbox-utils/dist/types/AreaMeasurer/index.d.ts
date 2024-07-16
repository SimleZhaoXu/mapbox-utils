import mapboxgl from 'mapbox-gl';
import { LayerType } from './layers';
type EventType = 'complete' | 'delete';
type EventData = {
    complete: {
        areaId: string;
        acreage: number;
        areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    };
    delete: {
        areaId: string;
    };
};
type Event<T extends EventType> = EventData[T] & {
    type: T;
};
type Options = {
    multiple?: boolean;
    layers?: Array<LayerType>;
};
export default class AreaMeasurer extends mapboxgl.Evented {
    private _map;
    private _enabled;
    private _source;
    private _cacheMap;
    private _current;
    private _next;
    private _multiple;
    private _layers;
    constructor(options?: Options);
    addTo(map: mapboxgl.Map): this;
    remove(): void;
    enable(): void;
    disable(): void;
    clear(): this;
    getAllArea(): {
        areaId: string;
        acreage: number;
        areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    }[];
    getAreaById(areaId: string): {
        areaId: string;
        acreage: number;
        areaData: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
    };
    on<T extends EventType>(type: T, listener: (e: Event<T>) => void): this;
    fire<T extends EventType>(type: T, properties?: EventData[T]): this;
    off<T extends EventType>(type?: T, listener?: (e: Event<T>) => void | undefined): this;
    private _handleEventListener;
    private _onData;
    private _OnDblClick;
    private _onMousemove;
    private _onClick;
    private _finish;
    private _remove;
    private _add;
    private _update;
    private _render;
    private _addSourceAnyLayer;
    private _removeSourceAndLayer;
}
export {};
