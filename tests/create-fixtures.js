const fs = require('fs');
const dir = 'tests/fixtures';

// 1x1 red PNG - valid minimal PNG
const pngBytes = Buffer.from([
  137,80,78,71,13,10,26,10,
  0,0,0,13,73,72,68,82,0,0,0,1,0,0,0,1,8,2,0,0,0,144,119,83,222,
  0,0,0,12,73,68,65,84,8,215,99,248,207,192,0,0,0,2,0,1,226,33,188,51,
  0,0,0,0,73,69,78,68,174,66,96,130
]);
fs.writeFileSync(dir+'/test.png', pngBytes);

// Minimal JPEG (1x1)
const jpgBytes = Buffer.from([
  255,216,255,224,0,16,74,70,73,70,0,1,1,0,0,1,0,1,0,0,
  255,219,0,67,0,8,6,6,7,6,5,8,7,7,7,9,9,8,10,12,20,13,12,11,11,12,
  25,18,19,15,20,29,26,31,30,29,26,28,28,32,36,46,39,32,34,44,35,28,28,
  40,55,41,44,48,49,52,52,52,31,39,57,61,56,50,60,46,51,52,50,
  255,192,0,11,8,0,1,0,1,1,1,17,0,
  255,196,0,31,0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,
  255,218,0,8,1,1,0,0,63,0,251,211,255,217
]);
fs.writeFileSync(dir+'/test.jpg', jpgBytes);

// Minimal PDF (1 page, no content stream needed)
const pdf = [
  '%PDF-1.4',
  '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
  '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj',
  'xref',
  '0 4',
  '0000000000 65535 f ',
  '0000000009 00000 n ',
  '0000000052 00000 n ',
  '0000000101 00000 n ',
  'trailer<</Size 4/Root 1 0 R>>',
  'startxref',
  '170',
  '%%EOF'
].join('\n');
fs.writeFileSync(dir+'/test.pdf', pdf);

// Fake image (txt file for invalid upload tests)
fs.writeFileSync(dir+'/fake-image.txt', 'this is not an image file');

console.log('Fixtures created:', fs.readdirSync(dir));
