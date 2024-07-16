type OmitProperty = 'source' | 'source-layer';
export type LayerType = Omit<mapboxgl.CircleLayer, OmitProperty> | Omit<mapboxgl.LineLayer, OmitProperty>;
declare const layers: Array<LayerType>;
export default layers;
