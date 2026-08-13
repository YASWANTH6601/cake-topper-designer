export type TextObject = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  rotation: number;
  curveLevel: number;
};

export type ImageObject = {
  id: string;
  type: "image";
  src: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type UploadedImageAsset = {
  id: string;
  src: string;
  name: string;
  originalWidth: number;
  originalHeight: number;
};

export type BackgroundObject = {
  type: "background";
  src: string;
  name: string;
  originalWidth: number;
  originalHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
};

export type EditorObject = TextObject | ImageObject;

export const BACKGROUND_SELECTION_ID = "__background__";
