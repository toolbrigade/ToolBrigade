"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { trackUsage } from "@/lib/trackUsage";

const componentMap: Record<string, React.ComponentType> = {
  WordCounter: dynamic(() => import("@/components/tools/WordCounter"), { ssr: false }),
  CaseConverter: dynamic(() => import("@/components/tools/CaseConverter"), { ssr: false }),
  JsonFormatter: dynamic(() => import("@/components/tools/JsonFormatter"), { ssr: false }),
  Base64EncoderDecoder: dynamic(() => import("@/components/tools/Base64EncoderDecoder"), { ssr: false }),
  UrlEncoderDecoder: dynamic(() => import("@/components/tools/UrlEncoderDecoder"), { ssr: false }),
  PxToRem: dynamic(() => import("@/components/tools/PxToRem"), { ssr: false }),
  ColorConverter: dynamic(() => import("@/components/tools/ColorConverter"), { ssr: false }),
  ImageResizer: dynamic(() => import("@/components/tools/ImageResizer"), { ssr: false }),
  ImageToBase64: dynamic(() => import("@/components/tools/ImageToBase64"), { ssr: false }),
  ImageCompressor: dynamic(() => import("@/components/tools/ImageCompressor"), { ssr: false }),
  MarkdownPreview: dynamic(() => import("@/components/tools/MarkdownPreview"), { ssr: false }),
  PngToJpg: dynamic(() => import("@/components/tools/PngToJpg"), { ssr: false }),
  JpgToPng: dynamic(() => import("@/components/tools/JpgToPng"), { ssr: false }),
  WebpToJpg: dynamic(() => import("@/components/tools/WebpToJpg"), { ssr: false }),
  WebpToPng: dynamic(() => import("@/components/tools/WebpToPng"), { ssr: false }),
  ImageCropper: dynamic(() => import("@/components/tools/ImageCropper"), { ssr: false }),
  Base64ToImage: dynamic(() => import("@/components/tools/Base64ToImage"), { ssr: false }),
  HeicToJpg: dynamic(() => import("@/components/tools/HeicToJpg"), { ssr: false }),
  SvgToPng: dynamic(() => import("@/components/tools/SvgToPng"), { ssr: false }),
  PngToSvg: dynamic(() => import("@/components/tools/PngToSvg"), { ssr: false }),
  ImageColorPicker: dynamic(() => import("@/components/tools/ImageColorPicker"), { ssr: false }),
  FaviconGenerator: dynamic(() => import("@/components/tools/FaviconGenerator"), { ssr: false }),
  ImageRotator: dynamic(() => import("@/components/tools/ImageRotator"), { ssr: false }),
  ImageFlipper: dynamic(() => import("@/components/tools/ImageFlipper"), { ssr: false }),
  GrayscaleConverter: dynamic(() => import("@/components/tools/GrayscaleConverter"), { ssr: false }),
  ImageToPdf: dynamic(() => import("@/components/tools/ImageToPdf"), { ssr: false }),
  MemeGenerator: dynamic(() => import("@/components/tools/MemeGenerator"), { ssr: false }),
  ImageWatermark: dynamic(() => import("@/components/tools/ImageWatermark"), { ssr: false }),
  PdfMerger: dynamic(() => import("@/components/tools/PdfMerger"), { ssr: false }),
  PdfSplitter: dynamic(() => import("@/components/tools/PdfSplitter"), { ssr: false }),
  PdfToImage: dynamic(() => import("@/components/tools/PdfToImage"), { ssr: false }),
  PdfPageRemover: dynamic(() => import("@/components/tools/PdfPageRemover"), { ssr: false }),
  PdfPageReorder: dynamic(() => import("@/components/tools/PdfPageReorder"), { ssr: false }),
  PdfRotator: dynamic(() => import("@/components/tools/PdfRotator"), { ssr: false }),
  PdfCompressor: dynamic(() => import("@/components/tools/PdfCompressor"), { ssr: false }),
  PdfToText: dynamic(() => import("@/components/tools/PdfToText"), { ssr: false }),
  PdfMetadata: dynamic(() => import("@/components/tools/PdfMetadata"), { ssr: false }),
  PdfPasswordRemover: dynamic(() => import("@/components/tools/PdfPasswordRemover"), { ssr: false }),
  PdfWatermark: dynamic(() => import("@/components/tools/PdfWatermark"), { ssr: false }),
  PdfBlankPageInserter: dynamic(() => import("@/components/tools/PdfBlankPageInserter"), { ssr: false }),
  CharacterCounter: dynamic(() => import("@/components/tools/CharacterCounter"), { ssr: false }),
  TextReverser: dynamic(() => import("@/components/tools/TextReverser"), { ssr: false }),
  DuplicateLineRemover: dynamic(() => import("@/components/tools/DuplicateLineRemover"), { ssr: false }),
  LineSorter: dynamic(() => import("@/components/tools/LineSorter"), { ssr: false }),
  WhitespaceRemover: dynamic(() => import("@/components/tools/WhitespaceRemover"), { ssr: false }),
  FindReplace: dynamic(() => import("@/components/tools/FindReplace"), { ssr: false }),
  TextToSlug: dynamic(() => import("@/components/tools/TextToSlug"), { ssr: false }),
  LoremIpsum: dynamic(() => import("@/components/tools/LoremIpsum"), { ssr: false }),
  TextDiff: dynamic(() => import("@/components/tools/TextDiff"), { ssr: false }),
  TextEncryptor: dynamic(() => import("@/components/tools/TextEncryptor"), { ssr: false }),
  MarkdownToHtml: dynamic(() => import("@/components/tools/MarkdownToHtml"), { ssr: false }),
  HtmlToMarkdown: dynamic(() => import("@/components/tools/HtmlToMarkdown"), { ssr: false }),
  TextToHtml: dynamic(() => import("@/components/tools/TextToHtml"), { ssr: false }),
  TextRepeater: dynamic(() => import("@/components/tools/TextRepeater"), { ssr: false }),
  RandomStringGenerator: dynamic(() => import("@/components/tools/RandomStringGenerator"), { ssr: false }),
  TextBinaryConverter: dynamic(() => import("@/components/tools/TextBinaryConverter"), { ssr: false }),
  MorseConverter: dynamic(() => import("@/components/tools/MorseConverter"), { ssr: false }),
  PalindromeChecker: dynamic(() => import("@/components/tools/PalindromeChecker"), { ssr: false }),
  JsonToCsv: dynamic(() => import("@/components/tools/JsonToCsv"), { ssr: false }),
  CsvToJson: dynamic(() => import("@/components/tools/CsvToJson"), { ssr: false }),
  XmlFormatter: dynamic(() => import("@/components/tools/XmlFormatter"), { ssr: false }),
  HtmlFormatter: dynamic(() => import("@/components/tools/HtmlFormatter"), { ssr: false }),
  CssFormatter: dynamic(() => import("@/components/tools/CssFormatter"), { ssr: false }),
  JsFormatter: dynamic(() => import("@/components/tools/JsFormatter"), { ssr: false }),
  UuidGenerator: dynamic(() => import("@/components/tools/UuidGenerator"), { ssr: false }),
  HashGenerator: dynamic(() => import("@/components/tools/HashGenerator"), { ssr: false }),
  JwtDecoder: dynamic(() => import("@/components/tools/JwtDecoder"), { ssr: false }),
  RegexTester: dynamic(() => import("@/components/tools/RegexTester"), { ssr: false }),
  CronGenerator: dynamic(() => import("@/components/tools/CronGenerator"), { ssr: false }),
  LengthConverter: dynamic(() => import("@/components/tools/LengthConverter"), { ssr: false }),
  WeightConverter: dynamic(() => import("@/components/tools/WeightConverter"), { ssr: false }),
  TemperatureConverter: dynamic(() => import("@/components/tools/TemperatureConverter"), { ssr: false }),
  CurrencyConverter: dynamic(() => import("@/components/tools/CurrencyConverter"), { ssr: false }),
  TimeZoneConverter: dynamic(() => import("@/components/tools/TimeZoneConverter"), { ssr: false }),
  NumberToWords: dynamic(() => import("@/components/tools/NumberToWords"), { ssr: false }),
  WordsToNumber: dynamic(() => import("@/components/tools/WordsToNumber"), { ssr: false }),
  BaseConverter: dynamic(() => import("@/components/tools/BaseConverter"), { ssr: false }),
  PercentageCalculator: dynamic(() => import("@/components/tools/PercentageCalculator"), { ssr: false }),
  AgeCalculator: dynamic(() => import("@/components/tools/AgeCalculator"), { ssr: false }),
  DateDiffCalculator: dynamic(() => import("@/components/tools/DateDiffCalculator"), { ssr: false }),
  BmiCalculator: dynamic(() => import("@/components/tools/BmiCalculator"), { ssr: false }),
  Calculator: dynamic(() => import("@/components/tools/Calculator"), { ssr: false }),
  QrGenerator: dynamic(() => import("@/components/tools/QrGenerator"), { ssr: false }),
  QrScanner: dynamic(() => import("@/components/tools/QrScanner"), { ssr: false }),
  BarcodeGenerator: dynamic(() => import("@/components/tools/BarcodeGenerator"), { ssr: false }),
  PasswordGenerator: dynamic(() => import("@/components/tools/PasswordGenerator"), { ssr: false }),
  RandomNumberGenerator: dynamic(() => import("@/components/tools/RandomNumberGenerator"), { ssr: false }),
  CoinDice: dynamic(() => import("@/components/tools/CoinDice"), { ssr: false }),
  ColorPaletteGenerator: dynamic(() => import("@/components/tools/ColorPaletteGenerator"), { ssr: false }),
  GradientGenerator: dynamic(() => import("@/components/tools/GradientGenerator"), { ssr: false }),
  PlaceholderImage: dynamic(() => import("@/components/tools/PlaceholderImage"), { ssr: false }),
  InvoiceNumberGenerator: dynamic(() => import("@/components/tools/InvoiceNumberGenerator"), { ssr: false }),
};

export default function ToolRenderer({ component, slug }: { component: string; slug: string }) {
  const tracked = useRef(false);
  const Component = componentMap[component];
  if (!Component) return <p className="text-[var(--text-muted)]">Tool coming soon.</p>;
  return (
    <div
      onPointerDown={() => { if (!tracked.current) { tracked.current = true; trackUsage(slug); } }}
      onKeyDown={() => { if (!tracked.current) { tracked.current = true; trackUsage(slug); } }}
    >
      <Component />
    </div>
  );
}
