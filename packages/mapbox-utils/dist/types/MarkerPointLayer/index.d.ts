import mapboxgl from 'mapbox-gl';
interface Event<T> {
    type: string;
    target: T;
}
interface ClickEvent<T> extends Event<T> {
    lngLat: mapboxgl.LngLat;
    data: any;
}
interface EventType<T> {
    click: ClickEvent<T>;
}
interface MarkerOptions extends Omit<mapboxgl.MarkerOptions, 'draggable' | 'element'> {
    element?: HTMLElement | ((data: any) => HTMLElement);
    [propName: string]: any;
}
type Data = GeoJSON.FeatureCollection<GeoJSON.Point>;
interface Options {
    key?: string;
    data: Data;
    markerOptions?: MarkerOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class MarkerPointLayer extends mapboxgl.Evented {
    private _map?;
    private _data;
    private _key;
    private _markerOptions;
    private _markerMap;
    private _fitBoundsOptions;
    private _lngLatBounds?;
    constructor(options: Options);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    easeTo(valOfKey: string | number, options?: Omit<mapboxgl.EaseToOptions, 'center'>): this;
    flyTo(valOfKey: string | number, options?: Omit<mapboxgl.FlyToOptions, 'center'>): this;
    setData(data: Data): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    private _clear;
    private _getFeature;
    private _getElement;
    private _getFitBoundsOptions;
    private _setLngLatBounds;
    private _init;
    private _setMarkerEvent;
}
export {};
