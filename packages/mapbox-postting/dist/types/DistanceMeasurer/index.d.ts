import mapboxgl from 'mapbox-gl';
import { LayerType } from './layers';
type EventType = 'complete' | 'delete';
type EventData = {
    complete: {
        pathId: string;
        length: number;
        pathData: GeoJSON.Feature<GeoJSON.LineString>;
    };
    delete: {
        pathId: string;
    };
};
type Event<T extends EventType> = EventData[T] & {
    type: T;
};
type Options = {
    multiple?: boolean;
    layers?: Array<LayerType>;
};
export default class DistanceMeasurer extends mapboxgl.Evented {
    private _map;
    private _enabled;
    private _source;
    private _cacheMap;
    private _currentPath;
    private _next;
    private _multiple;
    private _layers;
    constructor(options?: Options);
    addTo(map: mapboxgl.Map): this;
    remove(): void;
    enable(): void;
    disable(): void;
    clear(): this;
    getAllPath(): {
        pathId: string;
        length: number;
        pathData: GeoJSON.Feature<GeoJSON.LineString>;
    }[];
    getPathById(pathId: string): {
        pathId: string;
        length: number;
        pathData: GeoJSON.Feature<GeoJSON.LineString>;
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
