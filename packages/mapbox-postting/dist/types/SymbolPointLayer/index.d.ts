import mapboxgl from 'mapbox-gl';
import { symbolPaintKeys, symbolLayoutKeys } from '../utils/style';
type HighlightLayoutStyleKey = 'icon-image' | 'icon-size' | 'text-field' | 'text-size';
type HighlightPaintStyleKey = 'icon-opacity' | 'icon-color' | 'icon-halo-color' | 'icon-halo-width' | 'icon-halo-blur' | 'text-opacity' | 'text-color' | 'text-halo-color' | 'text-halo-width' | 'text-halo-blur';
interface Event<T> {
    type: string;
    target: T;
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData;
}
interface ClickEvent<T> extends Event<T> {
    data: any;
    lngLat: mapboxgl.LngLat;
    points: Array<{
        data: any;
        lngLat: mapboxgl.LngLat;
    }>;
}
interface MouseEvent<T> extends Event<T> {
    data: any;
    lngLat: mapboxgl.LngLat;
}
interface EventType<T> {
    click: ClickEvent<T>;
    mouseenter: MouseEvent<T>;
    mousemove: MouseEvent<T>;
    mouseleave: Event<T>;
}
interface HighlightOptions {
    trigger: 'click' | 'hover' | 'both';
    style: Pick<mapboxgl.SymbolLayout & mapboxgl.SymbolPaint, HighlightLayoutStyleKey | HighlightPaintStyleKey>;
}
interface Options {
    key: string;
    data: GeoJSON.FeatureCollection<GeoJSON.Point>;
    style: Pick<mapboxgl.SymbolLayout & mapboxgl.SymbolPaint, (typeof symbolPaintKeys)[number] | (typeof symbolLayoutKeys)[number]>;
    highlightOptions?: HighlightOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class SymbolPointLayer extends mapboxgl.Evented {
    private _id;
    private _key;
    private _map?;
    private _layer;
    private _lngLatBounds;
    private _fitBoundsOptions;
    private _layoutStyleMap;
    private _paintStyleMap;
    private _clickHighlightPropVal;
    private _hoverHighlightPropVal;
    private _expressionMap;
    private _highlightTrigger?;
    constructor(options: Options);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    setData(data: GeoJSON.FeatureCollection<GeoJSON.Point>): this;
    setHighlight(valOfKey: string | number): this;
    removeHighlight(): this;
    easeTo(valOfKey: string | number, options?: Omit<mapboxgl.EaseToOptions, 'center'>): this;
    flyTo(valOfKey: string | number, options?: Omit<mapboxgl.FlyToOptions, 'center'>): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    private _getFeature;
    private _setLngLatBounds;
    private _initHighlight;
    private _getFitBoundsOptions;
    private _getStyle;
    private _setEventListeners;
    private _getPoint;
    private _onClick;
    private _onMouseMove;
    private _onMouseLeave;
    private _onMouseEnter;
    private _setHighlight;
    private _removeHighlight;
}
export {};
