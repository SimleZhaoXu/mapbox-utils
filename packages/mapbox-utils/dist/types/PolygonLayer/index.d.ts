import mapboxgl from 'mapbox-gl';
declare const fillPaintKeys: readonly ["fill-opacity", "fill-color", "fill-pattern"];
declare const strokePaintKeys: readonly ["stroke-opacity", "stroke-color", "stroke-width", "stroke-blur", "stroke-dasharray", "stroke-pattern"];
type HighlightStrokeStyleKey = 'stroke-color' | 'stroke-opacity' | 'stroke-pattern' | 'stroke-width' | 'stroke-blur';
type StrokeKeyMap = {
    'stroke-color': 'line-color';
    'stroke-opacity': 'line-opacity';
    'stroke-width': 'line-width';
    'stroke-blur': 'line-blur';
    'stroke-dasharray': 'line-dasharray';
    'stroke-pattern': 'line-pattern';
};
type HighlightFillStyleKey = 'fill-opacity' | 'fill-pattern' | 'fill-color';
interface Event<T> {
    type: string;
    target: T;
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData;
}
interface ClickEvent<T> extends Event<T> {
    data: any;
    center: mapboxgl.LngLat;
    lngLatBounds: mapboxgl.LngLatBounds;
}
interface MouseEvent<T> extends Event<T> {
    data: any;
    center: mapboxgl.LngLat;
    lngLat: mapboxgl.LngLat;
}
export interface EventType<T> {
    click: ClickEvent<T>;
    mouseenter: MouseEvent<T>;
    mousemove: MouseEvent<T>;
    mouseleave: Event<T>;
}
interface HighlightOptions {
    trigger: 'click' | 'hover' | 'both';
    style: Pick<mapboxgl.FillPaint, HighlightFillStyleKey> & {
        [key in HighlightStrokeStyleKey]?: mapboxgl.LinePaint[StrokeKeyMap[key]];
    } & {
        'sort-key'?: number | mapboxgl.Expression;
    };
}
type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
    [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]];
} & {
    'sort-key'?: number | mapboxgl.Expression;
};
type Data = GeoJSON.FeatureCollection<GeoJSON.MultiPolygon | GeoJSON.Polygon>;
interface Options {
    key: string;
    cursor?: boolean;
    data: Data;
    style: Style;
    highlightOptions?: HighlightOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class PolygonLayer extends mapboxgl.Evented {
    private _map?;
    private _id;
    private _fillLayer;
    private _strokeLayer;
    private _key;
    private _lngLatBounds;
    private _fitBoundsOptions;
    private _strokePaintStyleMap;
    private _strokeLayoutStyleMap;
    private _fillPaintStyleMap;
    private _fillLayoutStyleMap;
    private _expressionMap;
    private _clickHighlightPropVal;
    private _hoverHighlightPropVal;
    private _highlightTrigger?;
    constructor(options: Options);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    setData(data: Data): this;
    setHighlight(valOfKey: string | number): this;
    removeHighlight(): this;
    fitTo(valOfKey: string | number, options?: mapboxgl.FitBoundsOptions): this;
    easeTo(valOfKey: string | number, options?: Omit<mapboxgl.EaseToOptions, 'center'>): this;
    flyTo(valOfKey: string | number, options?: Omit<mapboxgl.FlyToOptions, 'center'>): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): void;
    private _getFeature;
    private _setLngLatBounds;
    private _getFitBoundsOptions;
    private _getFillPaint;
    private _getStrokePaint;
    private _setEventListeners;
    private _onMouseClick;
    private _onMouseMove;
    private _onMouseLeave;
    private _onMouseEnter;
    private _removeHighlight;
    private _setHighlight;
    private _initHighlight;
}
export {};
