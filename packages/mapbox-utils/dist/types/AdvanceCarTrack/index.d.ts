import mapboxgl from 'mapbox-gl';
type Data = Array<{
    coordinates: [number, number];
    timestamp?: number;
}>;
type OmitProperty = 'source' | 'source-layer' | 'id' | 'filter';
type LayerType = Omit<mapboxgl.CircleLayer, OmitProperty> | Omit<mapboxgl.SymbolLayer, OmitProperty> | Omit<mapboxgl.LineLayer, OmitProperty>;
type LayerPool = {
    [k: string]: LayerType;
};
type Options = {
    data?: Data;
    speed?: number;
    layerPool: LayerPool;
    currentPathLayers?: string[];
    fullPathLayers?: string[];
    carLayers?: string[];
    nodeLayers?: string[];
    loop?: boolean;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
};
type EventType = 'moving' | 'complete';
type EventData = {
    moving: {
        timestamp: number;
    };
    complete: {};
};
type Event<T extends EventType> = EventData[T] & {
    type: T;
};
export default class AdvanceCarTrack extends mapboxgl.Evented {
    private _data;
    private _map;
    private _splittedPathData;
    private _fullPathData;
    private _source;
    private _loop;
    private _state;
    private _animationFrame;
    private _trackTimeStamp;
    private _realTimeStamp;
    private _speed;
    private _finished;
    private _useTimeStamp;
    private _lngLatBounds;
    private _fitBoundsOptions;
    private _layerPool;
    private _currentPathLayers;
    private _fullPathLayers;
    private _carLayers;
    private _nodeLayers;
    private _renderData;
    constructor(options: Options);
    get source(): string;
    get currentPathLayers(): string[];
    get fullPathLayers(): string[];
    get carLayers(): string[];
    get nodeLayers(): string[];
    get layerPool(): LayerPool;
    addTo(map: mapboxgl.Map): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    remove(): this;
    play(): this;
    pause(): this;
    stop(): this;
    setSpeed(speed: number): this;
    setTimestamp(timestamp: number): this;
    setData(data: Data | null): this;
    on<T extends EventType>(type: T, listener: (e: Event<T>) => void): this;
    fire<T extends EventType>(type: T, properties?: EventData[T] | undefined): this;
    once<T extends EventType>(type: T, listener: (e: Event<T>) => void): this;
    off<T extends EventType>(type?: T, listener?: (e: Event<T>) => void | undefined): this;
    private _onData;
    private _getFitBoundsOptions;
    private _addSourceAnyLayer;
    private _removeSourceAndLayer;
    private _calcSplittedPath;
    private _calcFullPath;
    private _search;
    private _getNodeData;
    private _init;
    private _animate;
    private _firePlayingEvent;
    private _getRenderData;
}
export {};
