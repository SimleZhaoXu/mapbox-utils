import mapboxgl from 'mapbox-gl';
import { linePaintKeys, lineLayoutKeys } from '../utils/style';
type HighlightStyleKey = 'line-color' | 'line-width' | 'line-blur' | 'line-opacity' | 'line-gap-width';
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
    style: Pick<mapboxgl.LinePaint, HighlightStyleKey>;
}
type Style = Pick<mapboxgl.LinePaint & mapboxgl.LineLayout, (typeof linePaintKeys)[number] | (typeof lineLayoutKeys)[number]>;
type Data = GeoJSON.FeatureCollection<GeoJSON.LineString>;
interface Options {
    key?: string;
    data: Data;
    style: Style;
    highlightOptions?: HighlightOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class LineLayer extends mapboxgl.Evented {
    private _id;
    private _key;
    private _layer;
    private _map?;
    private _lngLatBounds;
    private _fitBoundsOptions;
    private _styleMap;
    private _clickHighlightPropVal?;
    private _hoverHighlightPropVal?;
    private _expressionMap;
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
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    private _getFeature;
    private _setLngLatBounds;
    private _initHighlight;
    private _getFitBoundsOptions;
    private _getStyle;
    private _setEventListeners;
    private _onClick;
    private _onMouseMove;
    private _onMouseLeave;
    private _onMouseEnter;
    private _setHighlight;
    private _removeHighlight;
}
export {};
