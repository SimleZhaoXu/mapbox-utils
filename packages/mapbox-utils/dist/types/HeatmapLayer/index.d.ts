import mapboxgl from 'mapbox-gl';
interface HeatMapOptions {
    data: GeoJSON.FeatureCollection<GeoJSON.Point>;
    style?: mapboxgl.HeatmapPaint;
    fitBoundsOptions?: boolean | mapboxgl.FitBoundsOptions;
    minZoom?: number;
    maxZoom?: number;
}
export default class HeatmapLayer extends mapboxgl.Evented {
    private _map?;
    private _id;
    private _data;
    private _styleOptions?;
    private _sourceAndLayerId;
    private _lngLatBounds?;
    private _fitBoundsOptions?;
    private _minZoom;
    private _maxZoom;
    constructor(options: HeatMapOptions);
    get isOnMap(): boolean;
    addTo(map: mapboxgl.Map): this;
    remove(): this;
    setData(data: GeoJSON.FeatureCollection<GeoJSON.Point>): this;
    fitBounds(options?: mapboxgl.FitBoundsOptions): this;
    private _onData;
    private _setLngLatBounds;
    private _getFitBoundsOptions;
    private _addSourceAndLayer;
}
export {};
