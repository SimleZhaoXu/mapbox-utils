import mapboxgl from 'mapbox-gl';
import { linePaintKeys, lineLayoutKeys, circlePaintKeys, symbolPaintKeys, symbolLayoutKeys } from '../utils/style';
interface Event<T> {
    type: string;
    target: T;
}
interface EventType<T> {
    finish: Event<T>;
}
type PathStyle = Pick<mapboxgl.LinePaint & mapboxgl.LineLayout, (typeof linePaintKeys)[number] | (typeof lineLayoutKeys)[number]>;
type CircleStyle = Pick<mapboxgl.CirclePaint, (typeof circlePaintKeys)[number]>;
type SymbolStyle = Pick<mapboxgl.SymbolLayout & mapboxgl.SymbolPaint, (typeof symbolPaintKeys)[number] | (typeof symbolLayoutKeys)[number]>;
interface PathOptions {
    show?: boolean;
    style?: PathStyle;
}
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
type Data = Array<number[]>;
interface Options {
    data: Data;
    speed?: number;
    loop?: boolean;
    carLayer?: CircleCarOptions | SymbolCarOptions;
    pathLayer?: PathOptions & {
        isFull?: boolean;
    };
    currentPathLayer?: PathOptions;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
}
export default class CarTrack extends mapboxgl.Evented {
    private _map?;
    private _id;
    private _data;
    private _carLayer?;
    private _pathLayer?;
    private _currentPathLayer?;
    private _carLayerData;
    private _currentPathLayerData?;
    private _originPathLayerData;
    private _lngLatBounds;
    private _fitBoundsOptions;
    private _isFull;
    private _units;
    private _speed;
    private _loop;
    private _current;
    private _bearing;
    private _isPlaying;
    private _startTime;
    private _finished;
    private _currentLength;
    private _routeLength;
    private _pointLength;
    private _fRecord;
    private _pending;
    private _layerOptions;
    constructor(options: Options);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    setSpeed(speed: number): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    stop(): void;
    play(): void;
    pause(): void;
    replay(): void;
    on<T extends keyof EventType<this>>(type: T, listener: (ev: EventType<this>[T]) => void): this;
    private _initState;
    private _initLength;
    private _animate;
    private _getFitBoundsOptions;
    private _getCirclePaint;
    private _getSymbolStyle;
    private _getPathStyle;
    private _initLayer;
}
export {};
