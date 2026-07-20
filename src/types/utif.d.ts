declare module "utif" {
  interface IFD {
    width: number;
    height: number;
    [key: string]: unknown;
  }
  function decode(buffer: ArrayBuffer): IFD[];
  function decodeImage(buffer: ArrayBuffer, ifd: IFD): void;
  function toRGBA8(ifd: IFD): Uint8Array;
  const _default: { decode: typeof decode; decodeImage: typeof decodeImage; toRGBA8: typeof toRGBA8 };
  export = _default;
}
