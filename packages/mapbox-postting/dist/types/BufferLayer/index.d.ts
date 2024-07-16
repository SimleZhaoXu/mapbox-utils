import mapboxgl from 'mapbox-gl';
import { circlePaintKeys, symbolPaintKeys, symbolLayoutKeys } from '../utils/style';
declare const fillPaintKeys: readonly ["fill-opacity", "fill-color"];
declare const strokePaintKeys: readonly ["stroke-opacity", "stroke-color", "stroke-width", "stroke-blur", "stroke-dasharray"];
type StrokeKeyMap = {
    'stroke-color': 'line-color';
    'stroke-opacity': 'line-opacity';
    'stroke-width': 'line-width';
    'stroke-blur': 'line-blur';
    'stroke-dasharray': 'line-dasharray';
};
declare const units: readonly ["meters", "kilometers"];
type Units = (typeof units)[number];
interface Event<T> {
    type: string;
    target: T;
}
interface ChangeEvent<T> extends Event<T> {
    center: mapboxgl.LngLat;
    radius: number;
    units: Units;
    buffer: GeoJSON.Feature<GeoJSON.Polygon>;
}
export interface EventType<T> {
    change: ChangeEvent<T>;
}
type CircleStyle = Pick<mapboxgl.CirclePaint, (typeof circlePaintKeys)[number]>;
type SymbolStyle = Pick<mapboxgl.SymbolLayout & mapboxgl.SymbolPaint, (typeof symbolPaintKeys)[number] | (typeof symbolLayoutKeys)[number]>;
interface CircleCarOptions {
    show?: boolean;
    type?: 'circle';
    style?: CircleStyle;
}
interface SymbolCarOptions {
    show?: boolean;
    type: 'symbol';
    style?: SymbolStyle;
}
type Style = Pick<mapboxgl.FillPaint, (typeof fillPaintKeys)[number]> & {
    [key in (typeof strokePaintKeys)[number]]?: mapboxgl.LinePaint[StrokeKeyMap[key]];
};
interface Options {
    center?: number[];
    radius?: number;
    units?: Units;
    steps?: number;
    manual?: boolean;
    centerLayer?: CircleCarOptions | SymbolCarOptions;
    style: Style;
}
export default class BufferLayer extends mapboxgl.Evented {
    private _id;
    private _strokeLayer?;
    private _fillLayer;
    private _centerLayer?;
    private _map?;
    private _center;
    private _radius;
    private _units;
    private _steps;
    private _manual;
    private _style;
    private _bufferData;
    private _centerData;
    constructor(options: Options);
    get center(): number[];
    get radius(): number;
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    clear(): this;
    setOptions(options: {
        center?: number[];
        radius?: number;
        units?: Units;
        steps?: number;
    }): this;
    getData(): any;
    private _initStyle;
    private _getCirclePaint;
    private _getSymbolStyle;
    private _initLayer;
    private _onMapClick;
    private _update;
    private _initData;
}
export {};
