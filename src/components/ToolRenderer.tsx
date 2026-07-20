"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { trackUsage } from "@/lib/trackUsage";

const Loading = () => <div className="min-h-[120px]" />;

const componentMap: Record<string, React.ComponentType> = {
  WordCounter: dynamic(() => import("@/components/tools/WordCounter"), { ssr: false, loading: Loading }),
  CaseConverter: dynamic(() => import("@/components/tools/CaseConverter"), { ssr: false, loading: Loading }),
  JsonFormatter: dynamic(() => import("@/components/tools/JsonFormatter"), { ssr: false, loading: Loading }),
  Base64EncoderDecoder: dynamic(() => import("@/components/tools/Base64EncoderDecoder"), { ssr: false, loading: Loading }),
  UrlEncoderDecoder: dynamic(() => import("@/components/tools/UrlEncoderDecoder"), { ssr: false, loading: Loading }),
  PxToRem: dynamic(() => import("@/components/tools/PxToRem"), { ssr: false, loading: Loading }),
  ColorConverter: dynamic(() => import("@/components/tools/ColorConverter"), { ssr: false, loading: Loading }),
  ImageResizer: dynamic(() => import("@/components/tools/ImageResizer"), { ssr: false, loading: Loading }),
  ImageToBase64: dynamic(() => import("@/components/tools/ImageToBase64"), { ssr: false, loading: Loading }),
  ImageCompressor: dynamic(() => import("@/components/tools/ImageCompressor"), { ssr: false, loading: Loading }),
  MarkdownPreview: dynamic(() => import("@/components/tools/MarkdownPreview"), { ssr: false, loading: Loading }),
  PngToJpg: dynamic(() => import("@/components/tools/PngToJpg"), { ssr: false, loading: Loading }),
  JpgToPng: dynamic(() => import("@/components/tools/JpgToPng"), { ssr: false, loading: Loading }),
  WebpToJpg: dynamic(() => import("@/components/tools/WebpToJpg"), { ssr: false, loading: Loading }),
  WebpToPng: dynamic(() => import("@/components/tools/WebpToPng"), { ssr: false, loading: Loading }),
  ImageCropper: dynamic(() => import("@/components/tools/ImageCropper"), { ssr: false, loading: Loading }),
  Base64ToImage: dynamic(() => import("@/components/tools/Base64ToImage"), { ssr: false, loading: Loading }),
  HeicToJpg: dynamic(() => import("@/components/tools/HeicToJpg"), { ssr: false, loading: Loading }),
  SvgToPng: dynamic(() => import("@/components/tools/SvgToPng"), { ssr: false, loading: Loading }),
  PngToSvg: dynamic(() => import("@/components/tools/PngToSvg"), { ssr: false, loading: Loading }),
  ImageColorPicker: dynamic(() => import("@/components/tools/ImageColorPicker"), { ssr: false, loading: Loading }),
  FaviconGenerator: dynamic(() => import("@/components/tools/FaviconGenerator"), { ssr: false, loading: Loading }),
  ImageRotator: dynamic(() => import("@/components/tools/ImageRotator"), { ssr: false, loading: Loading }),
  ImageFlipper: dynamic(() => import("@/components/tools/ImageFlipper"), { ssr: false, loading: Loading }),
  GrayscaleConverter: dynamic(() => import("@/components/tools/GrayscaleConverter"), { ssr: false, loading: Loading }),
  ImageToPdf: dynamic(() => import("@/components/tools/ImageToPdf"), { ssr: false, loading: Loading }),
  MemeGenerator: dynamic(() => import("@/components/tools/MemeGenerator"), { ssr: false, loading: Loading }),
  ImageWatermark: dynamic(() => import("@/components/tools/ImageWatermark"), { ssr: false, loading: Loading }),
  PdfMerger: dynamic(() => import("@/components/tools/PdfMerger"), { ssr: false, loading: Loading }),
  PdfSplitter: dynamic(() => import("@/components/tools/PdfSplitter"), { ssr: false, loading: Loading }),
  PdfToImage: dynamic(() => import("@/components/tools/PdfToImage"), { ssr: false, loading: Loading }),
  PdfPageRemover: dynamic(() => import("@/components/tools/PdfPageRemover"), { ssr: false, loading: Loading }),
  PdfPageReorder: dynamic(() => import("@/components/tools/PdfPageReorder"), { ssr: false, loading: Loading }),
  PdfRotator: dynamic(() => import("@/components/tools/PdfRotator"), { ssr: false, loading: Loading }),
  PdfCompressor: dynamic(() => import("@/components/tools/PdfCompressor"), { ssr: false, loading: Loading }),
  PdfToText: dynamic(() => import("@/components/tools/PdfToText"), { ssr: false, loading: Loading }),
  PdfMetadata: dynamic(() => import("@/components/tools/PdfMetadata"), { ssr: false, loading: Loading }),
  PdfPasswordRemover: dynamic(() => import("@/components/tools/PdfPasswordRemover"), { ssr: false, loading: Loading }),
  PdfWatermark: dynamic(() => import("@/components/tools/PdfWatermark"), { ssr: false, loading: Loading }),
  PdfBlankPageInserter: dynamic(() => import("@/components/tools/PdfBlankPageInserter"), { ssr: false, loading: Loading }),
  CharacterCounter: dynamic(() => import("@/components/tools/CharacterCounter"), { ssr: false, loading: Loading }),
  TextReverser: dynamic(() => import("@/components/tools/TextReverser"), { ssr: false, loading: Loading }),
  DuplicateLineRemover: dynamic(() => import("@/components/tools/DuplicateLineRemover"), { ssr: false, loading: Loading }),
  LineSorter: dynamic(() => import("@/components/tools/LineSorter"), { ssr: false, loading: Loading }),
  WhitespaceRemover: dynamic(() => import("@/components/tools/WhitespaceRemover"), { ssr: false, loading: Loading }),
  FindReplace: dynamic(() => import("@/components/tools/FindReplace"), { ssr: false, loading: Loading }),
  TextToSlug: dynamic(() => import("@/components/tools/TextToSlug"), { ssr: false, loading: Loading }),
  LoremIpsum: dynamic(() => import("@/components/tools/LoremIpsum"), { ssr: false, loading: Loading }),
  TextDiff: dynamic(() => import("@/components/tools/TextDiff"), { ssr: false, loading: Loading }),
  TextEncryptor: dynamic(() => import("@/components/tools/TextEncryptor"), { ssr: false, loading: Loading }),
  MarkdownToHtml: dynamic(() => import("@/components/tools/MarkdownToHtml"), { ssr: false, loading: Loading }),
  HtmlToMarkdown: dynamic(() => import("@/components/tools/HtmlToMarkdown"), { ssr: false, loading: Loading }),
  TextToHtml: dynamic(() => import("@/components/tools/TextToHtml"), { ssr: false, loading: Loading }),
  TextRepeater: dynamic(() => import("@/components/tools/TextRepeater"), { ssr: false, loading: Loading }),
  RandomStringGenerator: dynamic(() => import("@/components/tools/RandomStringGenerator"), { ssr: false, loading: Loading }),
  TextBinaryConverter: dynamic(() => import("@/components/tools/TextBinaryConverter"), { ssr: false, loading: Loading }),
  MorseConverter: dynamic(() => import("@/components/tools/MorseConverter"), { ssr: false, loading: Loading }),
  PalindromeChecker: dynamic(() => import("@/components/tools/PalindromeChecker"), { ssr: false, loading: Loading }),
  JsonToCsv: dynamic(() => import("@/components/tools/JsonToCsv"), { ssr: false, loading: Loading }),
  CsvToJson: dynamic(() => import("@/components/tools/CsvToJson"), { ssr: false, loading: Loading }),
  XmlFormatter: dynamic(() => import("@/components/tools/XmlFormatter"), { ssr: false, loading: Loading }),
  HtmlFormatter: dynamic(() => import("@/components/tools/HtmlFormatter"), { ssr: false, loading: Loading }),
  CssFormatter: dynamic(() => import("@/components/tools/CssFormatter"), { ssr: false, loading: Loading }),
  JsFormatter: dynamic(() => import("@/components/tools/JsFormatter"), { ssr: false, loading: Loading }),
  UuidGenerator: dynamic(() => import("@/components/tools/UuidGenerator"), { ssr: false, loading: Loading }),
  HashGenerator: dynamic(() => import("@/components/tools/HashGenerator"), { ssr: false, loading: Loading }),
  JwtDecoder: dynamic(() => import("@/components/tools/JwtDecoder"), { ssr: false, loading: Loading }),
  RegexTester: dynamic(() => import("@/components/tools/RegexTester"), { ssr: false, loading: Loading }),
  CronGenerator: dynamic(() => import("@/components/tools/CronGenerator"), { ssr: false, loading: Loading }),
  LengthConverter: dynamic(() => import("@/components/tools/LengthConverter"), { ssr: false, loading: Loading }),
  WeightConverter: dynamic(() => import("@/components/tools/WeightConverter"), { ssr: false, loading: Loading }),
  TemperatureConverter: dynamic(() => import("@/components/tools/TemperatureConverter"), { ssr: false, loading: Loading }),
  CurrencyConverter: dynamic(() => import("@/components/tools/CurrencyConverter"), { ssr: false, loading: Loading }),
  TimeZoneConverter: dynamic(() => import("@/components/tools/TimeZoneConverter"), { ssr: false, loading: Loading }),
  NumberToWords: dynamic(() => import("@/components/tools/NumberToWords"), { ssr: false, loading: Loading }),
  WordsToNumber: dynamic(() => import("@/components/tools/WordsToNumber"), { ssr: false, loading: Loading }),
  BaseConverter: dynamic(() => import("@/components/tools/BaseConverter"), { ssr: false, loading: Loading }),
  PercentageCalculator: dynamic(() => import("@/components/tools/PercentageCalculator"), { ssr: false, loading: Loading }),
  AgeCalculator: dynamic(() => import("@/components/tools/AgeCalculator"), { ssr: false, loading: Loading }),
  DateDiffCalculator: dynamic(() => import("@/components/tools/DateDiffCalculator"), { ssr: false, loading: Loading }),
  BmiCalculator: dynamic(() => import("@/components/tools/BmiCalculator"), { ssr: false, loading: Loading }),
  Calculator: dynamic(() => import("@/components/tools/Calculator"), { ssr: false, loading: Loading }),
  QrGenerator: dynamic(() => import("@/components/tools/QrGenerator"), { ssr: false, loading: Loading }),
  QrScanner: dynamic(() => import("@/components/tools/QrScanner"), { ssr: false, loading: Loading }),
  BarcodeGenerator: dynamic(() => import("@/components/tools/BarcodeGenerator"), { ssr: false, loading: Loading }),
  PasswordGenerator: dynamic(() => import("@/components/tools/PasswordGenerator"), { ssr: false, loading: Loading }),
  RandomNumberGenerator: dynamic(() => import("@/components/tools/RandomNumberGenerator"), { ssr: false, loading: Loading }),
  CoinDice: dynamic(() => import("@/components/tools/CoinDice"), { ssr: false, loading: Loading }),
  ColorPaletteGenerator: dynamic(() => import("@/components/tools/ColorPaletteGenerator"), { ssr: false, loading: Loading }),
  GradientGenerator: dynamic(() => import("@/components/tools/GradientGenerator"), { ssr: false, loading: Loading }),
  PlaceholderImage: dynamic(() => import("@/components/tools/PlaceholderImage"), { ssr: false, loading: Loading }),
  InvoiceNumberGenerator: dynamic(() => import("@/components/tools/InvoiceNumberGenerator"), { ssr: false, loading: Loading }),

  PdfTextEditor: dynamic(() => import("@/components/tools/PdfTextEditor"), { ssr: false, loading: Loading }),
  PdfFormFiller: dynamic(() => import("@/components/tools/PdfFormFiller"), { ssr: false, loading: Loading }),
  PdfAnnotator: dynamic(() => import("@/components/tools/PdfAnnotator"), { ssr: false, loading: Loading }),
  PdfSignatureTool: dynamic(() => import("@/components/tools/PdfSignatureTool"), { ssr: false, loading: Loading }),
  PdfToWord: dynamic(() => import("@/components/tools/PdfToWord"), { ssr: false, loading: Loading }),
  MarkdownEditor: dynamic(() => import("@/components/tools/MarkdownEditor"), { ssr: false, loading: Loading }),
  RichTextEditor: dynamic(() => import("@/components/tools/RichTextEditor"), { ssr: false, loading: Loading }),
  DocxToPdf: dynamic(() => import("@/components/tools/DocxToPdf"), { ssr: false, loading: Loading }),
  WordToPdf: dynamic(() => import("@/components/tools/WordToPdf"), { ssr: false, loading: Loading }),
  CsvEditor: dynamic(() => import("@/components/tools/CsvEditor"), { ssr: false, loading: Loading }),
  XlsxToCsv: dynamic(() => import("@/components/tools/XlsxToCsv"), { ssr: false, loading: Loading }),
  CsvToXlsx: dynamic(() => import("@/components/tools/CsvToXlsx"), { ssr: false, loading: Loading }),
  JsonToXml: dynamic(() => import("@/components/tools/JsonToXml"), { ssr: false, loading: Loading }),
  XmlToJson: dynamic(() => import("@/components/tools/XmlToJson"), { ssr: false, loading: Loading }),
  YamlToJson: dynamic(() => import("@/components/tools/YamlToJson"), { ssr: false, loading: Loading }),
  JsonToYaml: dynamic(() => import("@/components/tools/JsonToYaml"), { ssr: false, loading: Loading }),
  MarkdownToPdf: dynamic(() => import("@/components/tools/MarkdownToPdf"), { ssr: false, loading: Loading }),
  HtmlToPdf: dynamic(() => import("@/components/tools/HtmlToPdf"), { ssr: false, loading: Loading }),
  ImageToWebp: dynamic(() => import("@/components/tools/ImageToWebp"), { ssr: false, loading: Loading }),
  AvifToJpg: dynamic(() => import("@/components/tools/AvifToJpg"), { ssr: false, loading: Loading }),
  TiffToJpg: dynamic(() => import("@/components/tools/TiffToJpg"), { ssr: false, loading: Loading }),
  GifToMp4: dynamic(() => import("@/components/tools/GifToMp4"), { ssr: false, loading: Loading }),
  Mp4ToGif: dynamic(() => import("@/components/tools/Mp4ToGif"), { ssr: false, loading: Loading }),
  ImageBgColorChanger: dynamic(() => import("@/components/tools/ImageBgColorChanger"), { ssr: false, loading: Loading }),
  ImageCanvasExtender: dynamic(() => import("@/components/tools/ImageCanvasExtender"), { ssr: false, loading: Loading }),
  SocialMediaResizer: dynamic(() => import("@/components/tools/SocialMediaResizer"), { ssr: false, loading: Loading }),
  CarouselGridSplitter: dynamic(() => import("@/components/tools/CarouselGridSplitter"), { ssr: false, loading: Loading }),
  SpriteSheetGenerator: dynamic(() => import("@/components/tools/SpriteSheetGenerator"), { ssr: false, loading: Loading }),
  ImageCollageMaker: dynamic(() => import("@/components/tools/ImageCollageMaker"), { ssr: false, loading: Loading }),
  ImageBorderAdder: dynamic(() => import("@/components/tools/ImageBorderAdder"), { ssr: false, loading: Loading }),
  DominantColorExtractor: dynamic(() => import("@/components/tools/DominantColorExtractor"), { ssr: false, loading: Loading }),
  ExifViewerRemover: dynamic(() => import("@/components/tools/ExifViewerRemover"), { ssr: false, loading: Loading }),
  ImageGrainEffect: dynamic(() => import("@/components/tools/ImageGrainEffect"), { ssr: false, loading: Loading }),
  ImageDuotoneGenerator: dynamic(() => import("@/components/tools/ImageDuotoneGenerator"), { ssr: false, loading: Loading }),
  ImagePixelator: dynamic(() => import("@/components/tools/ImagePixelator"), { ssr: false, loading: Loading }),
  ImageBlurTool: dynamic(() => import("@/components/tools/ImageBlurTool"), { ssr: false, loading: Loading }),
  ImageSharpenTool: dynamic(() => import("@/components/tools/ImageSharpenTool"), { ssr: false, loading: Loading }),
  ImageVignetteGenerator: dynamic(() => import("@/components/tools/ImageVignetteGenerator"), { ssr: false, loading: Loading }),
  ImageToIco: dynamic(() => import("@/components/tools/ImageToIco"), { ssr: false, loading: Loading }),
  AudioTrimmer: dynamic(() => import("@/components/tools/AudioTrimmer"), { ssr: false, loading: Loading }),
  AudioFormatConverter: dynamic(() => import("@/components/tools/AudioFormatConverter"), { ssr: false, loading: Loading }),
  AudioNormalizer: dynamic(() => import("@/components/tools/AudioNormalizer"), { ssr: false, loading: Loading }),
  TextToSpeech: dynamic(() => import("@/components/tools/TextToSpeech"), { ssr: false, loading: Loading }),
  SpeechToText: dynamic(() => import("@/components/tools/SpeechToText"), { ssr: false, loading: Loading }),
  AudioMerger: dynamic(() => import("@/components/tools/AudioMerger"), { ssr: false, loading: Loading }),
  VideoTrimmer: dynamic(() => import("@/components/tools/VideoTrimmer"), { ssr: false, loading: Loading }),
  VideoToAudio: dynamic(() => import("@/components/tools/VideoToAudio"), { ssr: false, loading: Loading }),
  VideoCompressor: dynamic(() => import("@/components/tools/VideoCompressor"), { ssr: false, loading: Loading }),
  VideoFormatConverter: dynamic(() => import("@/components/tools/VideoFormatConverter"), { ssr: false, loading: Loading }),
  VideoFrameExtractor: dynamic(() => import("@/components/tools/VideoFrameExtractor"), { ssr: false, loading: Loading }),
  VideoMuter: dynamic(() => import("@/components/tools/VideoMuter"), { ssr: false, loading: Loading }),
  SilenceRemover: dynamic(() => import("@/components/tools/SilenceRemover"), { ssr: false, loading: Loading }),
  WaveformGenerator: dynamic(() => import("@/components/tools/WaveformGenerator"), { ssr: false, loading: Loading }),
  VideoRotator: dynamic(() => import("@/components/tools/VideoRotator"), { ssr: false, loading: Loading }),
  VideoCropper: dynamic(() => import("@/components/tools/VideoCropper"), { ssr: false, loading: Loading }),
  SqlFormatter: dynamic(() => import("@/components/tools/SqlFormatter"), { ssr: false, loading: Loading }),
  YamlFormatter: dynamic(() => import("@/components/tools/YamlFormatter"), { ssr: false, loading: Loading }),
  EnvFileTool: dynamic(() => import("@/components/tools/EnvFileTool"), { ssr: false, loading: Loading }),
  HttpStatusCodes: dynamic(() => import("@/components/tools/HttpStatusCodes"), { ssr: false, loading: Loading }),
  CssUnitConverter: dynamic(() => import("@/components/tools/CssUnitConverter"), { ssr: false, loading: Loading }),
  MetaTagGenerator: dynamic(() => import("@/components/tools/MetaTagGenerator"), { ssr: false, loading: Loading }),
  RobotsTxtGenerator: dynamic(() => import("@/components/tools/RobotsTxtGenerator"), { ssr: false, loading: Loading }),
  GitignoreGenerator: dynamic(() => import("@/components/tools/GitignoreGenerator"), { ssr: false, loading: Loading }),
  FaviconPackageGenerator: dynamic(() => import("@/components/tools/FaviconPackageGenerator"), { ssr: false, loading: Loading }),
  JsonDiffChecker: dynamic(() => import("@/components/tools/JsonDiffChecker"), { ssr: false, loading: Loading }),
  RegexBuilder: dynamic(() => import("@/components/tools/RegexBuilder"), { ssr: false, loading: Loading }),
  ApiResponseViewer: dynamic(() => import("@/components/tools/ApiResponseViewer"), { ssr: false, loading: Loading }),
  CurlGenerator: dynamic(() => import("@/components/tools/CurlGenerator"), { ssr: false, loading: Loading }),
  HtmlEntityConverter: dynamic(() => import("@/components/tools/HtmlEntityConverter"), { ssr: false, loading: Loading }),
  MarkdownTableGenerator: dynamic(() => import("@/components/tools/MarkdownTableGenerator"), { ssr: false, loading: Loading }),
  CssBoxShadowGenerator: dynamic(() => import("@/components/tools/CssBoxShadowGenerator"), { ssr: false, loading: Loading }),
  CssBorderRadiusGenerator: dynamic(() => import("@/components/tools/CssBorderRadiusGenerator"), { ssr: false, loading: Loading }),
  CssFlexboxGenerator: dynamic(() => import("@/components/tools/CssFlexboxGenerator"), { ssr: false, loading: Loading }),
  CssGridGenerator: dynamic(() => import("@/components/tools/CssGridGenerator"), { ssr: false, loading: Loading }),
  SvgOptimizer: dynamic(() => import("@/components/tools/SvgOptimizer"), { ssr: false, loading: Loading }),
  Base32Converter: dynamic(() => import("@/components/tools/Base32Converter"), { ssr: false, loading: Loading }),
  AsciiUnicodeConverter: dynamic(() => import("@/components/tools/AsciiUnicodeConverter"), { ssr: false, loading: Loading }),
  TimestampConverter: dynamic(() => import("@/components/tools/TimestampConverter"), { ssr: false, loading: Loading }),
  SemverComparator: dynamic(() => import("@/components/tools/SemverComparator"), { ssr: false, loading: Loading }),
  PlatformCharacterLimits: dynamic(() => import("@/components/tools/PlatformCharacterLimits"), { ssr: false, loading: Loading }),
  TitleCaseConverter: dynamic(() => import("@/components/tools/TitleCaseConverter"), { ssr: false, loading: Loading }),
  PasswordStrengthChecker: dynamic(() => import("@/components/tools/PasswordStrengthChecker"), { ssr: false, loading: Loading }),
  EmailValidator: dynamic(() => import("@/components/tools/EmailValidator"), { ssr: false, loading: Loading }),
  CreditCardValidator: dynamic(() => import("@/components/tools/CreditCardValidator"), { ssr: false, loading: Loading }),
  IbanValidator: dynamic(() => import("@/components/tools/IbanValidator"), { ssr: false, loading: Loading }),
  VatIdValidator: dynamic(() => import("@/components/tools/VatIdValidator"), { ssr: false, loading: Loading }),
  SlugSeoChecker: dynamic(() => import("@/components/tools/SlugSeoChecker"), { ssr: false, loading: Loading }),
  ReadabilityChecker: dynamic(() => import("@/components/tools/ReadabilityChecker"), { ssr: false, loading: Loading }),
  DuplicateFileFinder: dynamic(() => import("@/components/tools/DuplicateFileFinder"), { ssr: false, loading: Loading }),
  IpLookup: dynamic(() => import("@/components/tools/IpLookup"), { ssr: false, loading: Loading }),
  PhoneNumberValidator: dynamic(() => import("@/components/tools/PhoneNumberValidator"), { ssr: false, loading: Loading }),
  PostalCodeValidator: dynamic(() => import("@/components/tools/PostalCodeValidator"), { ssr: false, loading: Loading }),
  SlugGeneratorAdvanced: dynamic(() => import("@/components/tools/SlugGeneratorAdvanced"), { ssr: false, loading: Loading }),
  BrokenLinkChecker: dynamic(() => import("@/components/tools/BrokenLinkChecker"), { ssr: false, loading: Loading }),
  LoanEmiCalculator: dynamic(() => import("@/components/tools/LoanEmiCalculator"), { ssr: false, loading: Loading }),
  CompoundInterestCalculator: dynamic(() => import("@/components/tools/CompoundInterestCalculator"), { ssr: false, loading: Loading }),
  TipCalculator: dynamic(() => import("@/components/tools/TipCalculator"), { ssr: false, loading: Loading }),
  DiscountCalculator: dynamic(() => import("@/components/tools/DiscountCalculator"), { ssr: false, loading: Loading }),
  FreelanceRateCalculator: dynamic(() => import("@/components/tools/FreelanceRateCalculator"), { ssr: false, loading: Loading }),
  CryptoPriceConverter: dynamic(() => import("@/components/tools/CryptoPriceConverter"), { ssr: false, loading: Loading }),
  DataStorageConverter: dynamic(() => import("@/components/tools/DataStorageConverter"), { ssr: false, loading: Loading }),
  SpeedConverter: dynamic(() => import("@/components/tools/SpeedConverter"), { ssr: false, loading: Loading }),
  AreaConverter: dynamic(() => import("@/components/tools/AreaConverter"), { ssr: false, loading: Loading }),
  VolumeConverter: dynamic(() => import("@/components/tools/VolumeConverter"), { ssr: false, loading: Loading }),
  PressureConverter: dynamic(() => import("@/components/tools/PressureConverter"), { ssr: false, loading: Loading }),
  EnergyConverter: dynamic(() => import("@/components/tools/EnergyConverter"), { ssr: false, loading: Loading }),
  FuelEconomyConverter: dynamic(() => import("@/components/tools/FuelEconomyConverter"), { ssr: false, loading: Loading }),
  CookingMeasurementConverter: dynamic(() => import("@/components/tools/CookingMeasurementConverter"), { ssr: false, loading: Loading }),
  RomanNumeralConverter: dynamic(() => import("@/components/tools/RomanNumeralConverter"), { ssr: false, loading: Loading }),
  GpaCalculator: dynamic(() => import("@/components/tools/GpaCalculator"), { ssr: false, loading: Loading }),
  GradeConverter: dynamic(() => import("@/components/tools/GradeConverter"), { ssr: false, loading: Loading }),
  PregnancyDueDateCalculator: dynamic(() => import("@/components/tools/PregnancyDueDateCalculator"), { ssr: false, loading: Loading }),
  TimeDurationCalculator: dynamic(() => import("@/components/tools/TimeDurationCalculator"), { ssr: false, loading: Loading }),
  WorkDaysCalculator: dynamic(() => import("@/components/tools/WorkDaysCalculator"), { ssr: false, loading: Loading }),
  CountdownGenerator: dynamic(() => import("@/components/tools/CountdownGenerator"), { ssr: false, loading: Loading }),
  StopwatchTimer: dynamic(() => import("@/components/tools/StopwatchTimer"), { ssr: false, loading: Loading }),
  RandomNameGenerator: dynamic(() => import("@/components/tools/RandomNameGenerator"), { ssr: false, loading: Loading }),
  RandomAddressGenerator: dynamic(() => import("@/components/tools/RandomAddressGenerator"), { ssr: false, loading: Loading }),
  FakeDataGenerator: dynamic(() => import("@/components/tools/FakeDataGenerator"), { ssr: false, loading: Loading }),
  BusinessNameGenerator: dynamic(() => import("@/components/tools/BusinessNameGenerator"), { ssr: false, loading: Loading }),
  SloganGenerator: dynamic(() => import("@/components/tools/SloganGenerator"), { ssr: false, loading: Loading }),
  AcronymGenerator: dynamic(() => import("@/components/tools/AcronymGenerator"), { ssr: false, loading: Loading }),
  NicknameGenerator: dynamic(() => import("@/components/tools/NicknameGenerator"), { ssr: false, loading: Loading }),
  TeamShuffler: dynamic(() => import("@/components/tools/TeamShuffler"), { ssr: false, loading: Loading }),
  RandomDecisionMaker: dynamic(() => import("@/components/tools/RandomDecisionMaker"), { ssr: false, loading: Loading }),
  BracketGenerator: dynamic(() => import("@/components/tools/BracketGenerator"), { ssr: false, loading: Loading }),
  RafflePicker: dynamic(() => import("@/components/tools/RafflePicker"), { ssr: false, loading: Loading }),
  EventPosterGenerator: dynamic(() => import("@/components/tools/EventPosterGenerator"), { ssr: false, loading: Loading }),
  VcardQrGenerator: dynamic(() => import("@/components/tools/VcardQrGenerator"), { ssr: false, loading: Loading }),
  WifiQrGenerator: dynamic(() => import("@/components/tools/WifiQrGenerator"), { ssr: false, loading: Loading }),
  SignatureGenerator: dynamic(() => import("@/components/tools/SignatureGenerator"), { ssr: false, loading: Loading }),
  WatermarkPatternGenerator: dynamic(() => import("@/components/tools/WatermarkPatternGenerator"), { ssr: false, loading: Loading }),
  HandwritingTextGenerator: dynamic(() => import("@/components/tools/HandwritingTextGenerator"), { ssr: false, loading: Loading }),
  CertificateGenerator: dynamic(() => import("@/components/tools/CertificateGenerator"), { ssr: false, loading: Loading }),
  IdPhotoResizer: dynamic(() => import("@/components/tools/IdPhotoResizer"), { ssr: false, loading: Loading }),
  PrintLayoutGenerator: dynamic(() => import("@/components/tools/PrintLayoutGenerator"), { ssr: false, loading: Loading }),
  ColorBlindnessSimulator: dynamic(() => import("@/components/tools/ColorBlindnessSimulator"), { ssr: false, loading: Loading }),
  ColorContrastChecker: dynamic(() => import("@/components/tools/ColorContrastChecker"), { ssr: false, loading: Loading }),
  GradientTextGenerator: dynamic(() => import("@/components/tools/GradientTextGenerator"), { ssr: false, loading: Loading }),
  NeumorphismGenerator: dynamic(() => import("@/components/tools/NeumorphismGenerator"), { ssr: false, loading: Loading }),
  MultiShadowGenerator: dynamic(() => import("@/components/tools/MultiShadowGenerator"), { ssr: false, loading: Loading }),
  FaviconPreviewTool: dynamic(() => import("@/components/tools/FaviconPreviewTool"), { ssr: false, loading: Loading }),
  MemeTemplates: dynamic(() => import("@/components/tools/MemeTemplates"), { ssr: false, loading: Loading }),
  ImagesToGif: dynamic(() => import("@/components/tools/ImagesToGif"), { ssr: false, loading: Loading }),
  ScreenResolutionReference: dynamic(() => import("@/components/tools/ScreenResolutionReference"), { ssr: false, loading: Loading }),
  FontPairingGenerator: dynamic(() => import("@/components/tools/FontPairingGenerator"), { ssr: false, loading: Loading }),
  PlaceholderTextGenerator: dynamic(() => import("@/components/tools/PlaceholderTextGenerator"), { ssr: false, loading: Loading }),
  EmojiPicker: dynamic(() => import("@/components/tools/EmojiPicker"), { ssr: false, loading: Loading }),
};

export default function ToolRenderer({ component, slug }: { component: string; slug: string }) {
  const tracked = useRef(false);
  const startTime = useRef<number>(0);
  const Component = componentMap[component];

  useEffect(() => {
    startTime.current = Date.now();

    const handleUnload = () => {
      if (!tracked.current) return;
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackUsage(slug, true, false, timeSpent);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (tracked.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackUsage(slug, true, false, timeSpent);
      }
    };
  }, [slug]);

  if (!Component) return <p className="text-[var(--text-muted)]">Tool coming soon.</p>;

  return (
    <div
      onPointerDown={() => {
        if (!tracked.current) {
          tracked.current = true;
          startTime.current = Date.now();
          trackUsage(slug);
        }
      }}
      onKeyDown={() => {
        if (!tracked.current) {
          tracked.current = true;
          startTime.current = Date.now();
          trackUsage(slug);
        }
      }}
    >
      <Component />
    </div>
  );
}
