import mapboxgl from 'mapbox-gl';
type Data = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | string | null;
type OmitProperty = 'source' | 'source-layer' | 'id';
type LayerType = Omit<mapboxgl.FillLayer, OmitProperty> | Omit<mapboxgl.LineLayer, OmitProperty>;
type LayerPool = {
    [k: string]: LayerType;
};
declare const highlightTriggers: readonly ["none", "click", "hover", "manual"];
type HighlightTrigger = (typeof highlightTriggers)[number];
export type EventType = 'click' | 'mousemove' | 'mouseenter' | 'mouseleave';
type EventData = {
    click: {
        data: any;
        originMapEvent: mapboxgl.MapMouseEvent;
        center?: mapboxgl.LngLat;
        lngLatBounds?: mapboxgl.LngLatBounds;
    };
    mousemove: {
        data: any;
        center?: mapboxgl.LngLat;
        originMapEvent: mapboxgl.MapMouseEvent;
    };
    mouseenter: {
        data: any;
        center?: mapboxgl.LngLat;
        originMapEvent: mapboxgl.MapMouseEvent;
    };
    mouseleave: {
        originMapEvent?: mapboxgl.MapMouseEvent;
    };
};
type Event<T extends EventType> = EventData[T] & {
    type: T;
};
type Options = {
    key?: string;
    data?: Data;
    layerPool?: LayerPool;
    layers?: string[];
    highlightTrigger?: HighlightTrigger;
    highlightLayers?: string[];
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
};
export default class AdvancePolygonLayer extends mapboxgl.Evented {
    private _source;
    private _map;
    protected _highlightFeatureId: string | number | null;
    private _lngLatBounds;
    private _key;
    private _data?;
    private _layerPool;
    private _layers;
    private _highlightTrigger;
    private _highlightLayers;
    private _isMouseOver;
    private _fitBoundsOptions;
    constructor(options: Options);
    get source(): string;
    get layers(): string[];
    get highlightLayers(): string[];
    get lngLatBounds(): mapboxgl.LngLatBoundsLike;
    get layerPool(): LayerPool;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    setData(data: Data): this;
    setHighlight(val: any): void;
    removeHighlight(): void;
    easeTo(val: any, options?: Omit<mapboxgl.EaseToOptions, 'center'>): this;
    flyTo(val: any, options?: Omit<mapboxgl.FlyToOptions, 'center'>): this;
    fitTo(val: any, options?: mapboxgl.FitBoundsOptions): this;
    on<T extends EventType>(type: T, listener: (e: Event<T>) => void): this;
    fire<T extends EventType>(type: T, properties?: EventData[T] | undefined): this;
    once<T extends EventType>(type: T, listener: (e: Event<T>) => void): this;
    off<T extends EventType>(type?: T, listener?: (e: Event<T>) => void | undefined): this;
    private _getFeature;
    private _fitBounds;
    private _setLngLatBounds;
    private _handleEventListener;
    private _onMouseLeave;
    private _onClick;
    private _isDefault;
    private _isBasic;
    private _getData;
    private _setHighlight;
    private _getEventFeature;
    private _onMouseMove;
    private _addCursor;
    private _removeCursor;
    private _onData;
    private _addSourceAnyLayer;
    private _getHighlightFilter;
    private _removeSourceAnyLayer;
    private _getGeometryFilter;
}
export {};
