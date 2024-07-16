import mapboxgl from 'mapbox-gl';
declare const linePaintKeys: readonly ["line-opacity", "line-color", "line-width", "line-blur", "line-dasharray"];
declare const vertexPaintKeys: readonly ["vertex-radius", "vertex-color", "vertex-opacity", "vertex-stroke-width", "vertex-stroke-color", "vertex-stroke-opacity"];
type VertexKeyMap = {
    'vertex-radius': 'circle-radius';
    'vertex-color': 'circle-color';
    'vertex-opacity': 'circle-opacity';
    'vertex-stroke-width': 'circle-stroke-width';
    'vertex-stroke-color': 'circle-stroke-color';
    'vertex-stroke-opacity': 'circle-stroke-opacity';
};
interface Event<T> {
    type: string;
    target: T;
}
interface FinishEvent<T> extends Event<T> {
    data: GeoJSON.Feature<GeoJSON.LineString>;
    length: number;
}
interface EventType<T> {
    finish: FinishEvent<T>;
}
type Style = Pick<mapboxgl.LinePaint, (typeof linePaintKeys)[number]> & {
    [key in (typeof vertexPaintKeys)[number]]?: mapboxgl.CirclePaint[VertexKeyMap[key]];
};
interface Options {
    enableEnter?: boolean;
    enableBackspace?: boolean;
    style?: Style;
    finishedStyle?: Style;
}
export default class LinePicker extends mapboxgl.Evented {
    private _id;
    private _map?;
    private _enableEnter;
    private _enableBackspace;
    private _vertexLayer?;
    private _lineLayer?;
    private _vertexList;
    private _lineCoordinates;
    private _picking;
    private _pending;
    private _finished;
    private _preFinished;
    private _preFinishedOnVertex;
    private _mouseOnVertex;
    private _data;
    private _style;
    private _finishedStyle;
    constructor(options?: Options);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    clear(): void;
    getData(): any;
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    private _initLayer;
    private _getStyle;
    private _initStyle;
    private _initFinishedStyle;
    private _initState;
    private _removeLayer;
    private _setEventListeners;
    private _updateVertex;
    private _updateLine;
    private _onVertexMouseMove;
    private _onVertexMouseLeave;
    private _getIndex;
    private _handleMouseMove;
    private _onMapMouseMove;
    private _onMapClick;
    private _complete;
    private _onKeyup;
    private _enterComplete;
    private _onMapDoubleClick;
    private _setFinishedStyle;
    private _getVertexSourceData;
    private _getLineSourceData;
}
export {};
