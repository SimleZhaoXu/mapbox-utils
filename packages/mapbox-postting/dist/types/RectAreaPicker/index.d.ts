import mapboxgl from 'mapbox-gl';
declare const fillPaintKeys: readonly ["fill-opacity", "fill-color"];
declare const strokePaintKeys: readonly ["stroke-opacity", "stroke-color", "stroke-width", "stroke-blur", "stroke-dasharray"];
type StrokeKeyMap = {
    'stroke-color': 'line-color';
    'stroke-opacity': 'line-opacity';
    'stroke-width': 'line-width';
    'stroke-blur': 'line-blur';
    'stroke-dasharray': 'line-dasharray';
};
declare const vertexPaintKeys: readonly ["vertex-radius", "vertex-color", "vertex-opacity", "vertex-stroke-width", "vertex-stroke-color", "vertex-stroke-opacity"];
type VertexKeyMap = {
    'vertex-radius': 'circle-radius';
    'vertex-color': 'circle-color';
    'vertex-opacity': 'circle-opacity';
    'vertex-stroke-width': 'circle-stroke-width';
    'vertex-stroke-color': 'circle-stroke-color';
    'vertex-stroke-opacity': 'circle-stroke-opacity';
};
type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
    [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]];
} & {
    [key in (typeof vertexPaintKeys)[number]]?: mapboxgl.CirclePaint[VertexKeyMap[key]];
};
interface Event<T> {
    type: string;
    target: T;
}
interface FinishEvent<T> extends Event<T> {
    data: GeoJSON.Feature<GeoJSON.Polygon>;
    acreage: number;
}
interface EventType<T> {
    finish: FinishEvent<T>;
}
interface Options {
    style?: Style;
    finishedStyle?: Style;
}
export default class RectAreaPicker extends mapboxgl.Evented {
    private _map?;
    private _id;
    private _vertexLayer?;
    private _strokeLayer?;
    private _fillLayer?;
    private _vertexList;
    private _strokeCoordinates;
    private _fillCoordinates;
    private _picking;
    private _finished;
    private _nw;
    private _se;
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
    private _removeLayer;
    private _initState;
    private _getVertexSourceData;
    private _getStrokeSourceData;
    private _getFillSourceData;
    private _setEventListeners;
    private _onMouseDown;
    private _onMouseUp;
    private _onMapDoubleClick;
    private _onMouseMove;
    private _updateStroke;
    private _updateVertex;
    private _updateFill;
    private _setFinishedStyle;
}
export {};
