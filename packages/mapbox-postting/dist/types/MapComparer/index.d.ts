import mapboxgl from 'mapbox-gl';
interface Options {
    container: HTMLElement | string;
    horizontal?: boolean;
    firstMapStyle: mapboxgl.MapboxOptions['style'];
    secondMapStyle: mapboxgl.MapboxOptions['style'];
    mapOptions: Omit<mapboxgl.MapboxOptions, 'style' | 'container'>;
}
export default class MapComparer {
    private _container;
    private _firstMap;
    private _secondMap;
    private _horizontal;
    private _swiper;
    private _controlContainer;
    private _mousemove;
    private _bounds;
    private _removed;
    currentPosition: number;
    get firstMap(): mapboxgl.Map;
    get secondMap(): mapboxgl.Map;
    constructor(options: Options);
    private _onResize;
    private _setPosition;
    private _setPointerEvents;
    private _onMove;
    private _getY;
    private _getX;
    private _onTouchEnd;
    private _onMouseUp;
    private _onDown;
    setSlider(p: number): void;
    remove(): void;
}
export {};
