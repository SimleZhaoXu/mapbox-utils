import mapboxgl from 'mapbox-gl';
interface Event<T> {
    type: string;
    target: T;
}
interface PointChangeEvent<T> extends Event<T> {
    point: [number, number];
    pointList: Array<[number, number]>;
}
interface PointClickEvent<T> extends Event<T> {
    point: [number, number];
}
interface EventType<T> {
    'get-point': PointChangeEvent<T>;
    'click-point': PointClickEvent<T>;
    'remove-point': PointChangeEvent<T>;
}
interface Options {
    markerOptions?: Omit<mapboxgl.MarkerOptions, 'draggable'>;
    multiple?: boolean;
    removeOnClick?: boolean;
}
export default class PointPicker extends mapboxgl.Evented {
    private _map?;
    private _multiple;
    private _removeOnClick;
    private _markerOptions;
    private _pointMap;
    constructor(options?: Options);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    setPoint(lngLat: mapboxgl.LngLatLike): this;
    getPoints(): number[][];
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    private _onMapClick;
    private _setMarkerEvent;
    removePoints(): void;
}
export {};
