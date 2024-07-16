import mapboxgl from 'mapbox-gl';
import { circlePaintKeys } from '../utils/style';
type HighlightStyleKey = 'circle-color' | 'circle-radius' | 'circle-blur' | 'circle-opacity' | 'circle-stroke-width' | 'circle-stroke-color' | 'circle-stroke-opacity';
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
    style: Pick<mapboxgl.CirclePaint, HighlightStyleKey>;
}
interface Options {
    key?: string;
    data: GeoJSON.FeatureCollection<GeoJSON.Point>;
    style: Pick<mapboxgl.CirclePaint, (typeof circlePaintKeys)[number]>;
    highlightOptions?: HighlightOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class CirclePointLayer extends mapboxgl.Evented {
    private _id;
    private _key;
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
