import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Undo,
  Autoformat,
} from "ckeditor5";
import faTranslations from "ckeditor5/translations/fa.js";
import "ckeditor5/ckeditor5.css";

export { ClassicEditor };

export const editorPlugins = [
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
  Undo,
  Autoformat,
];

export const editorTranslations = [faTranslations];