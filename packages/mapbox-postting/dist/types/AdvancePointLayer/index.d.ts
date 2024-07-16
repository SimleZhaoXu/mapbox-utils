import mapboxgl from 'mapbox-gl';
type Data = GeoJSON.FeatureCollection<GeoJSON.Point> | GeoJSON.Feature<GeoJSON.Point> | string | null;
type OmitProperty = 'source' | 'source-layer' | 'id';
type LayerType = Omit<mapboxgl.CircleLayer, OmitProperty> | Omit<mapboxgl.SymbolLayer, OmitProperty>;
type LayerPool = {
    [k: string]: LayerType;
};
declare const highlightTriggers: readonly ["none", "click", "hover", "manual"];
type HighlightTrigger = (typeof highlightTriggers)[number];
type Options = {
    key?: string;
    data?: Data;
    layerPool?: LayerPool;
    layers?: string[];
    highlightTrigger?: HighlightTrigger;
    highlightLayers?: string[];
    cluster?: boolean;
    clusterLayers?: string[];
    clusterMaxZoom?: number;
    clusterMinPoints?: number;
    clusterProperties?: any;
    clusterRadius?: number;
    maxzoom?: number;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
};
export type EventType = 'click' | 'mousemove' | 'mouseenter' | 'mouseleave' | 'cluster-click';
type EventData = {
    click: {
        data: any;
        lngLat: mapboxgl.LngLat;
        originMapEvent: mapboxgl.MapMouseEvent;
    };
    mousemove: {
        data: any;
        lngLat: mapboxgl.LngLat;
        originMapEvent: mapboxgl.MapMouseEvent;
    };
    mouseenter: {
        data: any;
        lngLat: mapboxgl.LngLat;
        originMapEvent: mapboxgl.MapMouseEvent;
    };
    mouseleave: {
        originMapEvent?: mapboxgl.MapMouseEvent;
    };
    'cluster-click': {
        clusterLeaves: Array<any>;
        lngLat: mapboxgl.LngLat;
        originMapEvent: mapboxgl.MapMouseEvent;
    };
};
type Event<T extends EventType> = EventData[T] & {
    type: T;
};
export default class AdvancePointLayer extends mapboxgl.Evented {
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
    private _cluster;
    private _clusterLayers;
    private _clusterMaxZoom?;
    private _clusterMinPoints?;
    private _clusterProperties?;
    private _clusterRadius?;
    private _maxzoom?;
    private _isMouseOver;
    private _fitBoundsOptions;
    constructor(options: Options);
    get source(): string;
    get layers(): string[];
    get highlightLayers(): string[];
    get clusterLayers(): string[];
    get lngLatBounds(): mapboxgl.LngLatBoundsLike;
    get layerPool(): LayerPool;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    setData(data: Data): this;
    setHighlight(val: any): void;
    removeHighlight(): void;
    easeTo(val: any, options?: Omit<mapboxgl.EaseToOptions, 'center'>): this;
    flyTo(valOfKey: any, options?: Omit<mapboxgl.FlyToOptions, 'center'>): this;
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
    private _isClustered;
    private _getData;
    private _setHighlight;
    private _getEventFeature;
    private _onMouseMove;
    private _addCursor;
    private _removeCursor;
    private _onData;
    private _addSourceAnyLayer;
    private _getHighlightFilter;
    private _getClusterFilter;
    private _getGeometryFilter;
    private _removeSourceAnyLayer;
}
export {};
