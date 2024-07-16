import mapboxgl from 'mapbox-gl';
import { fillExtrusionPaintKeys } from '../utils/style';
type HighlightStyleKey = 'fill-extrusion-opacity' | 'fill-extrusion-pattern' | 'fill-extrusion-color';
interface Event<T> {
    type: string;
    target: T;
    originalMapEvent: mapboxgl.MapLayerMouseEvent & mapboxgl.EventData;
}
interface ClickEvent<T> extends Event<T> {
    data: any;
    lngLat: mapboxgl.LngLat;
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
    style: Pick<mapboxgl.FillExtrusionPaint, HighlightStyleKey>;
}
interface Options {
    key?: string;
    radius?: number;
    steps?: number;
    data: GeoJSON.FeatureCollection<GeoJSON.Point>;
    style: Pick<mapboxgl.FillExtrusionPaint, (typeof fillExtrusionPaintKeys)[number]>;
    highlightOptions?: HighlightOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class PrismoidLayer extends mapboxgl.Evented {
    private _id;
    private _key;
    private _radius;
    private _steps;
    private _map?;
    private _layer;
    private _lngLatBounds;
    private _fitBoundsOptions;
    private _styleMap;
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
    private _transformData;
    private _getFeature;
    private _setLngLatBounds;
    private _initHighlight;
    private _getFitBoundsOptions;
    private _getPaint;
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
