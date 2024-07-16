import mapboxgl from 'mapbox-gl';
import { circlePaintKeys, textLayoutKeys, textPaintKeys } from '../utils/style';
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
interface ClusterClickEvent<T> extends Event<T> {
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
    'cluster-click': ClusterClickEvent<T>;
    mouseenter: MouseEvent<T>;
    mousemove: MouseEvent<T>;
    mouseleave: Event<T>;
}
type ClusterStyle = Pick<mapboxgl.CirclePaint, (typeof circlePaintKeys)[number]> & Pick<mapboxgl.SymbolLayout & mapboxgl.SymbolPaint, (typeof textLayoutKeys)[number] | (typeof textPaintKeys)[number]>;
interface HighlightOptions {
    trigger: 'click' | 'hover' | 'both';
    style: Pick<mapboxgl.CirclePaint, HighlightStyleKey>;
}
interface Options {
    key: string;
    data: GeoJSON.FeatureCollection<GeoJSON.Point>;
    style: Pick<mapboxgl.CirclePaint, (typeof circlePaintKeys)[number]>;
    clusterRadius?: number;
    clusterStyle: ClusterStyle;
    highlightOptions?: HighlightOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class CircleClusterLayer extends mapboxgl.Evented {
    private _id;
    private _layerId;
    private _clusterLayerId;
    private _clusterLabelLayerId;
    private _key;
    private _map?;
    private _clusterRadius;
    private _data;
    private _styleOptions;
    private _clusterStyleOptions;
    private _highlightOptions;
    private _lngLatBounds;
    private _fitBoundsOptions;
    private _styleMap;
    private _clickHighlightPropVal;
    private _hoverHighlightPropVal;
    private _expressionMap;
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
    private _addLayerAndSource;
    private _getPaint;
    private _getStyle;
    private _OnData;
    private _setEventListeners;
    private _onClusterClick;
    private _getPoint;
    private _onClick;
    private _onMouseEnter;
    private _onMouseMove;
    private _onMouseLeave;
    private _setHighlight;
    private _removeHighlight;
    private _removeLayerAndSource;
}
export {};
