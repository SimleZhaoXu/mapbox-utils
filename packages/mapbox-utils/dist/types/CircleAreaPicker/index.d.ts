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
type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
    [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]];
};
interface Event<T> {
    type: string;
    target: T;
}
interface FinishEvent<T> extends Event<T> {
    data: GeoJSON.Feature<GeoJSON.Polygon>;
    center: number;
    radius: number;
    acreage: number;
}
interface EventType<T> {
    finish: FinishEvent<T>;
}
interface Options {
    steps?: number;
    style?: Style;
    finishedStyle?: Style;
}
export default class CircleAreaPicker extends mapboxgl.Evented {
    private _map?;
    private _id;
    private _strokeLayer?;
    private _fillLayer?;
    private _strokeCoordinates;
    private _fillCoordinates;
    private _picking;
    private _finished;
    private _data;
    private _center;
    private _radius;
    private _steps;
    private _style;
    private _finishedStyle;
    constructor(options?: Options);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    clear(): void;
    getData(): any;
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    private _removeLayer;
    private _initState;
    private _getStyle;
    private _initFinishedStyle;
    private _initStyle;
    private _initLayer;
    private _getStrokeSourceData;
    private _getFillSourceData;
    private _setEventListeners;
    private _onMouseDown;
    private _onMouseUp;
    private _onMapDoubleClick;
    private _onMouseMove;
    private _updateStroke;
    private _updateFill;
    private _setFinishedStyle;
}
export {};
