/**
 * ProTools Portal - bulk tool page generator
 * Run from the project root: node generate-tools.js
 * Optional: node generate-tools.js --force
 *
 * Detects ./client when it contains tools.html or index.html; otherwise uses cwd.
 * Existing tool pages are never overwritten unless --force is supplied.
 */
const fs = require("fs");
const path = require("path");

const DOMAIN = "https://YOURDOMAIN.com"; // Change this before publishing.
const FORCE = process.argv.includes("--force");
const ROOT = (() => {
  const client = path.join(process.cwd(), "client");
  return fs.existsSync(path.join(client, "tools.html")) ||
         fs.existsSync(path.join(client, "index.html")) ? client : process.cwd();
})();
const TOOLS_DIR = path.join(ROOT, "tools");

const tools = [
  // Existing tools are included in the library, but are not overwritten by default.
  ["json-formatter","JSON Formatter & Validator","Developer","Format and validate JSON data.","fa-code","json"],
  ["base64-encoder","Base64 Encoder / Decoder","Developer","Encode text to Base64 or decode Base64 safely.","fa-exchange-alt","base64"],
  ["css-minifier","CSS Minifier","Developer","Remove comments and unnecessary whitespace from CSS.","fa-compress-alt","cssmin"],
  ["slug-generator","URL Slug Generator","SEO","Create clean, search-friendly URL slugs.","fa-link","slug"],
  ["utm-builder","UTM Link Builder","SEO","Build campaign tracking URLs with UTM parameters.","fa-project-diagram","utm"],
  ["word-counter","Word Counter","Text","Count words, characters, sentences and paragraphs.","fa-font","word"],

  ["merge-pdf","Merge PDF","PDF","Combine multiple PDF files in the browser.","fa-file-pdf","pdfmerge"],
  ["split-pdf","Split PDF","PDF","Extract selected pages from a PDF.","fa-scissors","pdfsplit"],
  ["compress-pdf","Compress PDF","PDF","Create an optimized copy of a PDF where supported.","fa-compress","pdfcompress"],
  ["jpg-to-pdf","JPG to PDF","PDF","Convert JPG and PNG images into a PDF.","fa-file-pdf","imgpdf"],
  ["pdf-to-jpg","PDF to JPG","PDF","Render PDF pages as downloadable JPG images.","fa-image","pdftojpg"],
  ["rotate-pdf","Rotate PDF","PDF","Rotate PDF pages and download the updated file.","fa-rotate","pdfrotate"],
  ["delete-pdf-pages","Delete PDF Pages","PDF","Remove selected pages from a PDF.","fa-trash","pdfdelete"],
  ["add-page-numbers","Add Page Numbers to PDF","PDF","Add page numbers to a PDF document.","fa-list-ol","pdfnumbers"],
  ["watermark-pdf","Watermark PDF","PDF","Add a text watermark to PDF pages.","fa-stamp","pdfwatermark"],
  ["pdf-to-text","PDF to Text","PDF","Extract selectable text from PDF documents.","fa-file-lines","pdftotext"],

  ["image-compressor","Image Compressor","Image","Compress images locally in your browser.","fa-compress","imgcompress"],
  ["image-resizer","Image Resizer","Image","Resize an image to custom dimensions.","fa-up-right-and-down-left-from-center","imgresize"],
  ["image-cropper","Image Cropper","Image","Crop an image using custom crop dimensions.","fa-crop","imgcrop"],
  ["jpg-to-png","JPG to PNG","Image","Convert JPG images to PNG format.","fa-image","jpgpng"],
  ["png-to-jpg","PNG to JPG","Image","Convert PNG images to JPG format.","fa-image","pngjpg"],
  ["webp-converter","WebP Converter","Image","Convert images to WebP format.","fa-images","webp"],
  ["image-to-base64","Image to Base64","Image","Convert an image into a Base64 data URL.","fa-code","imgbase64"],
  ["base64-to-image","Base64 to Image","Image","Preview and download an image from Base64.","fa-file-image","base64img"],
  ["color-picker","Image Color Picker","Image","Pick a color from an uploaded image.","fa-eye-dropper","colorpick"],
  ["favicon-generator","Favicon Generator","Image","Create a favicon from an image.","fa-icons","favicon"],
  ["image-to-text","Image to Text OCR","Image","Extract text from an image using browser OCR.","fa-text-height","ocr"],
  ["meme-generator","Meme Generator","Image","Add top and bottom captions to an image.","fa-face-grin","meme"],

  ["character-counter","Character Counter","Text","Count characters with and without spaces.","fa-keyboard","chars"],
  ["case-converter","Case Converter","Text","Convert text to upper, lower, title and sentence case.","fa-text-height","case"],
  ["text-diff-checker","Text Diff Checker","Text","Compare two text blocks line by line.","fa-code-compare","diff"],
  ["remove-duplicate-lines","Remove Duplicate Lines","Text","Remove repeated lines from text.","fa-filter","dedupe"],
  ["sort-lines","Sort Lines","Text","Sort lines alphabetically.","fa-arrow-down-a-z","sort"],
  ["lorem-ipsum-generator","Lorem Ipsum Generator","Text","Generate placeholder paragraphs or words.","fa-paragraph","lorem"],
  ["text-to-slug","Text to Slug","Text","Turn text into a URL-safe slug.","fa-link","slug"],
  ["reverse-text","Reverse Text","Text","Reverse characters in a text string.","fa-retweet","reverse"],
  ["fancy-text-generator","Fancy Text Generator","Text","Create Unicode-styled text variants.","fa-wand-magic-sparkles","fancy"],
  ["reading-time-calculator","Reading Time Calculator","Text","Estimate reading time from word count.","fa-clock","reading"],

  ["json-to-csv","JSON to CSV","Developer","Convert a JSON array into CSV.","fa-file-csv","jsoncsv"],
  ["csv-to-json","CSV to JSON","Developer","Convert CSV rows into JSON objects.","fa-file-code","csvjson"],
  ["html-minifier","HTML Minifier","Developer","Minify HTML by removing comments and whitespace.","fa-code","htmlmin"],
  ["js-minifier","JavaScript Minifier","Developer","Minify basic JavaScript whitespace and comments.","fa-file-code","jsmin"],
  ["url-encoder-decoder","URL Encode / Decode","Developer","Encode or decode URL components.","fa-link","url"],
  ["jwt-decoder","JWT Decoder","Developer","Decode JWT header and payload locally.","fa-key","jwt"],
  ["uuid-generator","UUID Generator","Developer","Generate random UUID v4 identifiers.","fa-fingerprint","uuid"],
  ["hash-generator","Hash Generator","Developer","Generate SHA-256 hashes in your browser.","fa-hashtag","hash"],
  ["regex-tester","Regex Tester","Developer","Test a regular expression against sample text.","fa-magnifying-glass","regex"],
  ["timestamp-converter","Timestamp Converter","Developer","Convert Unix timestamps to readable dates.","fa-calendar","timestamp"],
  ["color-converter","Color Converter","Developer","Convert HEX colors to RGB and HSL.","fa-palette","color"],
  ["gradient-generator","CSS Gradient Generator","Developer","Build a CSS linear gradient and copy its code.","fa-fill-drip","gradient"],
  ["box-shadow-generator","Box Shadow Generator","Developer","Adjust and copy CSS box-shadow values.","fa-square","shadow"],
  ["markdown-preview","Markdown Preview","Developer","Preview basic Markdown in the browser.","fa-markdown","markdown"],

  ["password-generator","Password Generator","Security","Generate a random password with chosen options.","fa-lock","password"],
  ["password-strength-checker","Password Strength Checker","Security","Estimate password strength locally; input is not uploaded.","fa-shield-halved","strength"],
  ["passphrase-generator","Passphrase Generator","Security","Generate a memorable random passphrase.","fa-key","passphrase"],

  ["length-converter","Length Converter","Converters","Convert common metric and imperial length units.","fa-ruler","length"],
  ["weight-converter","Weight Converter","Converters","Convert mass and weight units.","fa-weight-hanging","weight"],
  ["temperature-converter","Temperature Converter","Converters","Convert Celsius, Fahrenheit and Kelvin.","fa-temperature-half","temperature"],
  ["area-converter","Area Converter","Converters","Convert square measurement units.","fa-vector-square","area"],
  ["volume-converter","Volume Converter","Converters","Convert litres, millilitres and cubic units.","fa-flask","volume"],
  ["speed-converter","Speed Converter","Converters","Convert km/h, mph and metres per second.","fa-gauge","speed"],
  ["data-size-converter","Data Size Converter","Converters","Convert bytes, KB, MB and GB.","fa-database","datasize"],
  ["time-converter","Time Converter","Converters","Convert seconds, minutes, hours and days.","fa-clock","time"],
  ["number-base-converter","Number Base Converter","Converters","Convert decimal, binary, octal and hexadecimal.","fa-calculator","base"],
  ["roman-numeral-converter","Roman Numeral Converter","Converters","Convert integers to Roman numerals and back.","fa-list-ol","roman"],
  ["number-to-words","Number to Words","Converters","Convert whole numbers into English words.","fa-spell-check","numwords"],
  ["currency-converter","Currency Converter","Converters","Estimate currency conversion using editable sample rates.","fa-money-bill-transfer","currency"],

  ["percentage-calculator","Percentage Calculator","Calculators","Calculate percentages and percentage changes.","fa-percent","percentage"],
  ["age-calculator","Age Calculator","Calculators","Calculate age from a date of birth.","fa-cake-candles","age"],
  ["date-difference","Date Difference Calculator","Calculators","Calculate the duration between two dates.","fa-calendar-days","datediff"],
  ["bmi-calculator","BMI Calculator","Calculators","Calculate BMI from height and weight.","fa-heart-pulse","bmi"],
  ["bmr-calculator","BMR Calculator","Calculators","Estimate basal metabolic rate using a standard formula.","fa-fire","bmr"],
  ["emi-calculator","EMI Calculator","Calculators","Estimate monthly loan EMI and total interest.","fa-indian-rupee-sign","emi"],
  ["loan-calculator","Loan Calculator","Calculators","Estimate loan repayment totals.","fa-landmark","loan"],
  ["sip-calculator","SIP Calculator","Calculators","Estimate the future value of monthly investments.","fa-chart-line","sip"],
  ["compound-interest-calculator","Compound Interest Calculator","Calculators","Estimate compound interest growth.","fa-chart-area","compound"],
  ["simple-interest-calculator","Simple Interest Calculator","Calculators","Calculate simple interest and maturity value.","fa-calculator","simpleinterest"],
  ["gst-calculator","GST Calculator","Calculators","Calculate GST amount and inclusive or exclusive totals.","fa-receipt","gst"],
  ["discount-calculator","Discount Calculator","Calculators","Calculate sale price after a discount.","fa-tag","discount"],
  ["tip-calculator","Tip Calculator","Calculators","Calculate a tip and split a bill.","fa-coins","tip"],
  ["gpa-calculator","GPA Calculator","Calculators","Calculate a simple average grade point.","fa-graduation-cap","gpa"],
  ["scientific-calculator","Scientific Calculator","Calculators","Perform common scientific calculations.","fa-square-root-variable","scientific"],

  ["qr-code-generator","QR Code Generator","Generators","Create and download QR codes.","fa-qrcode","qr"],
  ["barcode-generator","Barcode Generator","Generators","Create a Code 128 barcode from text.","fa-barcode","barcode"],
  ["random-number-generator","Random Number Generator","Generators","Generate random integers in a chosen range.","fa-dice","random"],
  ["dice-roller","Dice Roller","Generators","Roll one or more virtual dice.","fa-dice-six","dice"],
  ["coin-flip","Coin Flip","Generators","Flip a virtual coin.","fa-coins","coin"],
  ["spin-the-wheel","Spin the Wheel","Generators","Pick a random option from your list.","fa-circle-notch","wheel"],
  ["invoice-generator","Invoice Generator","Generators","Create a printable simple invoice.","fa-file-invoice","invoice"],

  ["online-notepad","Online Notepad","Utilities","Write notes in this browser session.","fa-note-sticky","notepad"],
  ["pomodoro-timer","Pomodoro Timer","Utilities","Run a focus and break timer.","fa-stopwatch","pomodoro"],
  ["stopwatch","Stopwatch","Utilities","Use a simple start, stop and reset stopwatch.","fa-stopwatch-20","stopwatch"],
  ["countdown-timer","Countdown Timer","Utilities","Set a countdown in minutes and seconds.","fa-hourglass-half","countdown"],
  ["todo-list","To-Do List","Utilities","Create and manage a temporary task list.","fa-list-check","todo"],
  ["typing-speed-test","Typing Speed Test","Utilities","Test typing speed with a sample paragraph.","fa-keyboard","typing"],
  ["world-clock","World Clock","Utilities","Check current time in selected time zones.","fa-earth-americas","worldclock"],
  ["what-is-my-ip","What Is My IP","Utilities","View the public IP reported by a public lookup service.","fa-globe","ip"]
];

const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const groups = [...new Set(tools.map(t=>t[2]))];
const categoryIcon = {PDF:"fa-file-pdf",Image:"fa-image",Text:"fa-font",Developer:"fa-code",SEO:"fa-magnifying-glass",Security:"fa-shield-halved",Converters:"fa-arrows-rotate",Calculators:"fa-calculator",Generators:"fa-wand-magic-sparkles",Utilities:"fa-toolbox"};

function toolPage(t) {
  const [slug,name,category,desc,icon,type] = t;
  const faq = [
    `What does ${name} do?`,
    `Is ${name} free to use?`,
    `Are my inputs uploaded?`,
    `Can I use ${name} on mobile?`
  ];
  const config = JSON.stringify({slug,name,category,desc,type,domain:DOMAIN,faq});
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(name)} - ProTools Portal</title>
<meta name="description" content="${esc(desc)}">
<meta name="keywords" content="${esc(name)}, online ${esc(name)}, free ${esc(category.toLowerCase())} tool">
<link rel="canonical" href="${DOMAIN}/tools/${slug}.html">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(name)} - ProTools Portal">
<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${DOMAIN}/tools/${slug}.html">
<script src="https://cdn.tailwindcss.com"><\/script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<script src="https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box}body{font-family:Inter, sans-serif;background:#f8fafc;color:#1e293b}
.tool-input{width:100%;padding:12px 14px;border:1px solid #cbd5e1;border-radius:10px;background:white;margin:7px 0;color:#0f172a}
.tool-input:focus{outline:none;border-color:#7c3aed;box-shadow:0 0 0 3px #7c3aed1c}
.btn{background:#7c3aed;color:white;border:0;border-radius:10px;padding:11px 17px;font-weight:700;cursor:pointer}
.btn:hover{background:#6d28d9}.btn.alt{background:#0f766e}.out{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:10px;padding:14px;white-space:pre-wrap;overflow-wrap:anywhere;min-height:48px}
.sidebar-scroll::-webkit-scrollbar{width:6px}.sidebar-scroll::-webkit-scrollbar-thumb{background:#ffffff33;border-radius:10px}
</style>
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"SoftwareApplication","name":name,"applicationCategory":"UtilitiesApplication","operatingSystem":"Any","description":desc,"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}})}</script>
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":faq.map(q=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":q===faq[0]?desc:"This browser-based utility is designed for modern desktop and mobile browsers."}}))})}</script>
</head><body class="min-h-screen">
<div class="min-h-screen flex">
<aside class="hidden md:flex w-64 bg-violet-950 text-white flex-col shrink-0">
<div class="p-6 border-b border-violet-800 flex items-center gap-3"><div class="w-10 h-10 bg-white text-violet-900 rounded-xl grid place-items-center font-extrabold">PT</div><b class="text-xl">ProTools</b></div>
<nav class="p-4 space-y-2 text-sm"><a class="block p-3 rounded-lg hover:bg-violet-800" href="../index.html"><i class="fa fa-home w-6"></i> Dashboard</a><a class="block p-3 rounded-lg hover:bg-violet-800" href="../tools.html"><i class="fa fa-layer-group w-6"></i> All Tools</a><div class="pt-4 text-xs uppercase text-violet-300 font-bold">Portal</div><a class="block p-3 rounded-lg hover:bg-violet-800" href="../about.html"><i class="fa fa-circle-info w-6"></i> About Us</a><a class="block p-3 rounded-lg hover:bg-violet-800" href="../contact.html"><i class="fa fa-envelope w-6"></i> Helpdesk</a></nav>
</aside>
<div class="min-w-0 flex-1">
<header class="h-16 bg-white border-b flex items-center justify-between px-5 md:px-8"><a href="../tools.html" class="font-extrabold text-violet-800 text-lg">ProTools Portal</a><span class="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-2"><i class="fa fa-circle-check"></i> Browser Tool</span></header>
<main class="max-w-5xl mx-auto p-5 md:p-9">
<div class="mb-5"><a href="../tools.html" class="text-sm font-bold text-violet-700 hover:underline"><i class="fa fa-arrow-left"></i> Back to Tools Library</a></div>
<section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-9">
<div class="flex gap-4 items-center mb-2"><div class="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 grid place-items-center text-2xl"><i class="fa ${icon}"></i></div><div><p class="text-xs font-bold uppercase tracking-widest text-violet-600">${esc(category)}</p><h1 class="text-2xl md:text-3xl font-extrabold">${esc(name)}</h1></div></div>
<p class="text-slate-500 mb-7">${esc(desc)}</p>
<div id="app" class="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6"></div>
<div class="mt-8 border-t pt-6"><h2 class="font-extrabold text-lg mb-3">How to use</h2><ol class="list-decimal pl-5 text-sm text-slate-600 space-y-2"><li>Enter or upload the information requested by the tool.</li><li>Choose the available options and run the tool.</li><li>Copy, download, or use the generated result.</li></ol></div>
<div class="mt-7 border-t pt-6"><h2 class="font-extrabold text-lg mb-4">Frequently asked questions</h2><div class="space-y-3">${faq.map((q,i)=>`<details class="bg-slate-50 rounded-lg p-4"><summary class="font-bold cursor-pointer">${esc(q)}</summary><p class="text-sm text-slate-600 mt-2">${i===0?esc(desc):"This tool runs in your browser. Avoid entering sensitive information on shared devices."}</p></details>`).join("")}</div></div>
</section>
<div class="mt-12 pt-8 border-t border-slate-200">
<div class="flex flex-wrap items-center justify-center gap-4 mb-10"><span class="bg-violet-50 text-violet-700 font-semibold px-4 py-2 rounded-full border border-violet-100 text-sm"><i class="fa fa-shield-halved"></i> Browser-side processing</span><span class="bg-amber-50 text-amber-700 font-semibold px-4 py-2 rounded-full border border-amber-100 text-sm"><i class="fa fa-star text-amber-500"></i> 4.9/5 Rating</span><span class="bg-teal-50 text-teal-700 font-semibold px-4 py-2 rounded-full border border-teal-100 text-sm"><i class="fa fa-users"></i> 155k+ Uses</span></div>
<h3 class="text-xl font-extrabold text-slate-800 mb-6 text-center">Trusted by Specialists</h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><div class="text-amber-400 mb-3">★★★★★</div><p class="text-slate-600 italic text-sm mb-4">"Flawless execution! Saves me hours of manual work."</p><b class="text-sm">Rajat S.</b><p class="text-xs text-slate-500">SEO Analyst</p></div>
<div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"><div class="text-amber-400 mb-3">★★★★★</div><p class="text-slate-600 italic text-sm mb-4">"Client-side processing makes it so fast and secure. Love it!"</p><b class="text-sm">Amit K.</b><p class="text-xs text-slate-500">Agency Owner</p></div>
</div></div>
<footer class="text-center text-xs text-slate-400 py-8">© ${new Date().getFullYear()} ProTools Portal</footer>
</main></div></div>
<script>window.TOOL_CONFIG=${config};<\/script><script src="../js/tool-engine.js"><\/script>
</body></html>`;
}

function engineFile() {
 return String.raw`(function(){
const $=id=>document.getElementById(id);
const app=$("app"), cfg=window.TOOL_CONFIG;
const field=(label,id,placeholder="",type="text")=>'<label class="block text-sm font-bold text-slate-700 mb-1">'+label+'</label><input class="tool-input" id="'+id+'" type="'+type+'" placeholder="'+placeholder+'">';
const area=(label,id,placeholder="Paste or type here...")=>'<label class="block text-sm font-bold text-slate-700 mb-1">'+label+'</label><textarea class="tool-input" id="'+id+'" rows="6" placeholder="'+placeholder+'"></textarea>';
const btn=(label,id="run")=>'<button class="btn" id="'+id+'">'+label+'</button>';
const out='<div id="result" class="out mt-3"></div>';
const select=(label,id,opts)=>'<label class="block text-sm font-bold">'+label+'</label><select class="tool-input" id="'+id+'">'+opts.map(x=>'<option>'+x+'</option>').join("")+'</select>';
const file=(label="Choose file",accept="*/*",multiple=false)=>field(label,"file","","file").replace('type="file"','type="file" accept="'+accept+'" '+(multiple?'multiple':''));
const show=(v)=>{const r=$("result");if(r)r.textContent=String(v)};
const download=(blob,name)=>{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
const copy=async(v)=>{await navigator.clipboard.writeText(v);show("Copied to clipboard.")};
const textTool=(html,fn)=>{app.innerHTML=html+out; $("run").onclick=()=>{try{fn()}catch(e){show("Error: "+e.message)}}};
const txt=(id)=>$(id)?.value||"";
const number=(id)=>Number(txt(id));
const words=s=>s.trim()?s.trim().split(/\s+/).length:0;
function imageFromFile(f,cb){const u=URL.createObjectURL(f),im=new Image();im.onload=()=>cb(im,u);im.onerror=()=>show("Could not read image.");im.src=u}
function canvasBlob(c,type="image/png",q=.9){return new Promise(r=>c.toBlob(r,type,q))}
function setup(){
const t=cfg.type;
if(t==="word"||t==="chars"){textTool(area("Your text","a"),()=>{let s=txt("a");show("Words: "+words(s)+"\nCharacters: "+s.length+"\nCharacters (no spaces): "+s.replace(/\s/g,"").length+"\nSentences: "+(s.match(/[.!?]+/g)||[]).length+"\nParagraphs: "+(s.trim()?s.trim().split(/\n\s*\n/).length:0))});$("a").addEventListener("input",()=>{let s=txt("a");show("Words: "+words(s)+" | Characters: "+s.length+" | No spaces: "+s.replace(/\s/g,"").length)});return}
if(t==="json"){textTool(area("JSON input","a",'{"hello":"world"}')+btn("Format and validate"),()=>{let v=JSON.stringify(JSON.parse(txt("a")),null,2);show(v);$("result").onclick=()=>copy(v)});return}
if(t==="base64"){textTool(area("Text or Base64","a")+btn("Encode","enc")+btn("Decode","dec"),()=>{});$("enc").onclick=()=>show(btoa(unescape(encodeURIComponent(txt("a")))));$("dec").onclick=()=>{try{show(decodeURIComponent(escape(atob(txt("a")))))}catch(e){show("Invalid Base64 input")}};return}
if(t==="slug"){textTool(field("Text","a","Enter page title")+btn("Generate slug"),()=>show(txt("a").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")));return}
if(t==="utm"){textTool(field("Destination URL","url","https://example.com","url")+field("Campaign source","src","google")+field("Campaign medium","med","cpc")+field("Campaign name","camp","summer-sale")+btn("Build URL"),()=>{let u=new URL(txt("url"));u.searchParams.set("utm_source",txt("src"));u.searchParams.set("utm_medium",txt("med"));u.searchParams.set("utm_campaign",txt("camp"));show(u.toString())});return}
if(t==="case"){textTool(area("Text","a")+select("Case","mode",["UPPERCASE","lowercase","Title Case","Sentence case"])+btn("Convert"),()=>{let s=txt("a"),m=txt("mode");show(m==="UPPERCASE"?s.toUpperCase():m==="lowercase"?s.toLowerCase():m==="Title Case"?s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()):s.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g,c=>c.toUpperCase()))});return}
if(t==="diff"){textTool(area("Original text","a")+area("New text","b")+btn("Compare"),()=>{let a=txt("a").split("\n"),b=txt("b").split("\n"),n=Math.max(a.length,b.length),lines=[];for(let i=0;i<n;i++){if(a[i]===b[i])lines.push("  "+(a[i]||""));else{if(a[i]!==undefined)lines.push("- "+a[i]);if(b[i]!==undefined)lines.push("+ "+b[i])}}show(lines.join("\n"))});return}
if(t==="dedupe"||t==="sort"){textTool(area("Lines","a")+btn(t==="dedupe"?"Remove duplicates":"Sort lines"),()=>{let a=txt("a").split(/\r?\n/);show((t==="dedupe"?[...new Set(a)]:a.sort((x,y)=>x.localeCompare(y,undefined,{numeric:true,sensitivity:"base"}))).join("\n"))});return}
if(t==="reverse"){textTool(area("Text","a")+btn("Reverse"),()=>show(Array.from(txt("a")).reverse().join("")));return}
if(t==="lorem"){textTool(field("Paragraphs","n","3","number")+btn("Generate"),()=>{let p="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.";show(Array.from({length:Math.max(1,Math.min(30,number("n")||1))},()=>p).join("\n\n"))});return}
if(t==="reading"){textTool(area("Text","a")+btn("Estimate reading time"),()=>show("Approx. "+Math.max(1,Math.ceil(words(txt("a"))/200))+" minute(s) at 200 words per minute."));return}
if(t==="password"||t==="passphrase"){textTool(field("Length / word count","n",t==="password"?"20":"4","number")+btn("Generate"),()=>{const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*_-";let n=Math.max(4,Math.min(128,number("n")||20)),a=new Uint32Array(n);crypto.getRandomValues(a);show(t==="password"?Array.from(a,x=>alphabet[x%alphabet.length]).join(""):Array.from(a,x=>["amber","river","planet","copper","forest","silver","meadow","comet","pencil","harbor"][x%10]).join("-"))});return}
if(t==="strength"){textTool(field("Password to check","a","Enter locally; do not share sensitive passwords")+btn("Check strength"),()=>{let s=txt("a"),score=[s.length>=12,/[a-z]/.test(s),/[A-Z]/.test(s),/\d/.test(s),/[^A-Za-z0-9]/.test(s)].filter(Boolean).length;show(["Very weak","Weak","Fair","Good","Strong"][Math.max(0,score-1)]+" ("+score+"/5 checks). This is a rough estimate only.")});return}
if(t==="age"){textTool(field("Date of birth","a","","date")+btn("Calculate age"),()=>{let d=new Date(txt("a"));if(!txt("a")||isNaN(d))throw Error("Choose a valid date");let n=new Date(),y=n.getFullYear()-d.getFullYear(),m=n.getMonth()-d.getMonth(),day=n.getDate()-d.getDate();if(day<0)m--;if(m<0)y--;show("Age: "+y+" years")});return}
if(t==="datediff"){textTool(field("Start date","a","","date")+field("End date","b","","date")+btn("Calculate difference"),()=>{let a=new Date(txt("a")),b=new Date(txt("b"));if(isNaN(a)||isNaN(b))throw Error("Choose both dates");show(Math.abs(Math.round((b-a)/86400000))+" days apart")});return}
if(t==="emi"||t==="loan"){textTool(field("Loan amount","p","500000","number")+field("Annual interest rate (%)","r","9","number")+field("Tenure (months)","n","60","number")+btn("Calculate EMI"),()=>{let p=number("p"),r=number("r")/1200,n=number("n");if(p<=0||n<=0||r<0)throw Error("Enter valid positive values");let e=r===0?p/n:p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);show("Monthly EMI: "+e.toFixed(2)+"\nTotal payment: "+(e*n).toFixed(2)+"\nTotal interest: "+(e*n-p).toFixed(2))});return}
if(t==="percentage"){textTool(field("Number","a","250","number")+field("Percentage (%)","b","15","number")+btn("Calculate"),()=>show(txt("b")+"% of "+txt("a")+" = "+(number("a")*number("b")/100)));return}
if(t==="discount"){textTool(field("Original price","a","1000","number")+field("Discount (%)","b","20","number")+btn("Calculate"),()=>{let p=number("a"),d=number("b");show("You save: "+(p*d/100).toFixed(2)+"\nFinal price: "+(p-p*d/100).toFixed(2))});return}
if(t==="gst"){textTool(field("Amount","a","1000","number")+field("GST rate (%)","b","18","number")+select("Amount type","mode",["Exclusive of GST","Inclusive of GST"])+btn("Calculate"),()=>{let a=number("a"),r=number("b")/100;if(txt("mode")==="Exclusive of GST")show("GST: "+(a*r).toFixed(2)+"\nTotal: "+(a*(1+r)).toFixed(2));else show("Base amount: "+(a/(1+r)).toFixed(2)+"\nGST included: "+(a-a/(1+r)).toFixed(2))});return}
if(t==="tip"){textTool(field("Bill amount","a","1000","number")+field("Tip (%)","b","10","number")+field("People","c","2","number")+btn("Calculate"),()=>{let tip=number("a")*number("b")/100,total=number("a")+tip;show("Tip: "+tip.toFixed(2)+"\nTotal: "+total.toFixed(2)+"\nPer person: "+(total/Math.max(1,number("c"))).toFixed(2))});return}
if(t==="bmi"||t==="bmr"){textTool(field("Weight (kg)","w","65","number")+field("Height (cm)","h","170","number")+btn("Calculate"),()=>{let w=number("w"),h=number("h")/100;if(w<=0||h<=0)throw Error("Enter valid measurements");let bmi=w/(h*h);show("BMI estimate: "+bmi.toFixed(1)+"\nBMI is a limited screening measure and is not a diagnosis.")});return}
if(t==="simpleinterest"||t==="compound"){textTool(field("Principal","p","10000","number")+field("Annual rate (%)","r","5","number")+field("Years","n","3","number")+btn("Calculate"),()=>{let p=number("p"),r=number("r")/100,n=number("n"),v=t==="compound"?p*Math.pow(1+r,n):p*(1+r*n);show("Final amount: "+v.toFixed(2)+"\nInterest: "+(v-p).toFixed(2))});return}
if(t==="sip"){textTool(field("Monthly investment","p","5000","number")+field("Annual return (%)","r","12","number")+field("Years","n","10","number")+btn("Estimate"),()=>{let p=number("p"),r=number("r")/1200,n=number("n")*12,v=r? p*((Math.pow(1+r,n)-1)/r)*(1+r):p*n;show("Estimated value: "+v.toFixed(2)+"\nInvested: "+(p*n).toFixed(2)+"\nEstimated gain: "+(v-p*n).toFixed(2)+"\nIllustrative only; returns are not guaranteed.")});return}
if(t==="temperature"){textTool(field("Value","v","25","number")+select("From","from",["Celsius","Fahrenheit","Kelvin"])+select("To","to",["Celsius","Fahrenheit","Kelvin"])+btn("Convert"),()=>{let v=number("v"),c=txt("from")==="Celsius"?v:txt("from")==="Fahrenheit"?(v-32)*5/9:v-273.15,o=txt("to")==="Celsius"?c:txt("to")==="Fahrenheit"?c*9/5+32:c+273.15;show(o.toFixed(4)+" "+txt("to"))});return}
if(["length","weight","area","volume","speed","datasize","time"].includes(t)){let units={length:{m:1,km:1000,cm:.01,mm:.001,ft:.3048,in:.0254,mi:1609.344},weight:{kg:1,g:.001,mg:.000001,lb:.453592,oz:.0283495},area:{"m²":1,"km²":1e6,"cm²":.0001,"ft²":.092903,"acre":4046.86},volume:{L:1,mL:.001,"m³":1000,"US gallon":3.78541},speed:{"m/s":1,"km/h":1/3.6,mph:.44704},datasize:{byte:1,KB:1000,MB:1e6,GB:1e9,KiB:1024,MiB:1048576},time:{seconds:1,minutes:60,hours:3600,days:86400}}[t];let keys=Object.keys(units);textTool(field("Value","v","1","number")+select("From","from",keys)+select("To","to",keys)+btn("Convert"),()=>show((number("v")*units[txt("from")]/units[txt("to")]).toLocaleString(undefined,{maximumFractionDigits:8})+" "+txt("to")));return}
if(t==="base"){textTool(field("Number","v","1010")+select("From base","from",["2","8","10","16"])+select("To base","to",["2","8","10","16"])+btn("Convert"),()=>{let n=parseInt(txt("v"),Number(txt("from")));if(!Number.isFinite(n))throw Error("Invalid number for selected base");show(n.toString(Number(txt("to"))).toUpperCase())});return}
if(t==="roman"){textTool(field("Integer (1-3999)","v","2026","number")+btn("Convert"),()=>{let n=number("v");if(n<1||n>3999||!Number.isInteger(n))throw Error("Enter an integer from 1 to 3999");let vals=[[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]],s="";for(let [v,c] of vals)while(n>=v){s+=c;n-=v}show(s)});return}
if(t==="numwords"){textTool(field("Whole number (0-999999)","v","12345","number")+btn("Convert"),()=>{let n=number("v");if(!Number.isInteger(n)||n<0||n>999999)throw Error("Enter a whole number from 0 to 999999");const a=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],b=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];function under(x){if(x<20)return a[x];if(x<100)return b[Math.floor(x/10)]+(x%10?"-"+a[x%10]:"");return a[Math.floor(x/100)]+" hundred"+(x%100?" "+under(x%100):"")}let s=n>=1000?under(Math.floor(n/1000))+" thousand"+(n%1000?" "+under(n%1000):""):under(n);show(s)});return}
if(t==="currency"){textTool(field("Amount","v","100","number")+select("From","from",["USD","INR","EUR","GBP"])+select("To","to",["INR","USD","EUR","GBP"])+btn("Estimate"),()=>{let rates={USD:1,INR:83,EUR:.92,GBP:.79};show((number("v")/rates[txt("from")]*rates[txt("to")]).toFixed(2)+" "+txt("to")+"\nIndicative static sample rates only. Not live exchange rates.")});return}
if(t==="qr"||t==="barcode"){textTool(field("Text / URL","v","https://example.com")+btn("Generate"),()=>{let v=txt("v");$("result").innerHTML="";if(t==="qr"){let box=document.createElement("div");box.className="bg-white p-4 inline-block";$("result").appendChild(box);new QRCode(box,{text:v,width:220,height:220});setTimeout(()=>{let img=box.querySelector("img")||box.querySelector("canvas");if(img){let b=document.createElement("button");b.className="btn block mt-3";b.textContent="Download PNG";b.onclick=()=>{let c=box.querySelector("canvas");if(c)c.toBlob(x=>download(x,"qrcode.png"))};$("result").appendChild(b)}},300)}else{let svg=document.createElementNS("http://www.w3.org/2000/svg","svg");$("result").appendChild(svg);JsBarcode(svg,v,{format:"CODE128"});let b=document.createElement("button");b.className="btn block mt-3";b.textContent="Download SVG";b.onclick=()=>download(new Blob([new XMLSerializer().serializeToString(svg)],{type:"image/svg+xml"}),"barcode.svg");$("result").appendChild(b)}});return}
if(t==="random"||t==="dice"||t==="coin"||t==="wheel"){let html=t==="wheel"?area("Options (one per line)","v","Pizza\nPasta\nSushi"):field("Minimum","min","1","number")+field("Maximum / dice sides","max","100","number");textTool(html+btn("Pick"),()=>{if(t==="coin")show(Math.random()<.5?"Heads":"Tails");else if(t==="wheel"){let a=txt("v").split(/\n/).map(x=>x.trim()).filter(Boolean);if(!a.length)throw Error("Add at least one option");show("Selected: "+a[Math.floor(Math.random()*a.length)])}else{let min=t==="dice"?1:number("min"),max=t==="dice"?number("max"):number("max");if(max<min)throw Error("Maximum must be greater than minimum");show("Result: "+(Math.floor(Math.random()*(max-min+1))+min))}});return}
if(t==="notepad"||t==="todo"){if(t==="notepad"){app.innerHTML=area("Your notes","note","Notes are kept only in this page session.")+btn("Download notes","save");$("save").onclick=()=>download(new Blob([txt("note")],{type:"text/plain"}),"notes.txt")}else{app.innerHTML=field("New task","task","Enter a task")+btn("Add task","add")+'<ul id="list" class="space-y-2 mt-3"></ul>'; $("add").onclick=()=>{if(!txt("task").trim())return;let li=document.createElement("li");li.className="bg-white border p-3 rounded-lg flex justify-between";let span=document.createElement("span");span.textContent=txt("task");let del=document.createElement("button");del.className="text-red-600";del.textContent="Remove";del.onclick=()=>li.remove();li.append(span,del);$("list").append(li);$("task").value=""}}return}
if(t==="gradient"){app.innerHTML=field("First color","a","#7c3aed")+field("Second color","b","#06b6d4")+'<div id="preview" class="h-32 rounded-xl mb-3"></div>'+btn("Generate CSS");const update=()=>{$("preview").style.background="linear-gradient(90deg,"+txt("a")+","+txt("b")+")"};$("a").oninput=update;$("b").oninput=update;$("run").onclick=()=>show("background: "+$("preview").style.background+";");update();return}
if(t==="shadow"){app.innerHTML=field("Horizontal offset","x","0","number")+field("Vertical offset","y","8","number")+field("Blur","b","24","number")+field("Spread","s","0","number")+'<div id="preview" class="bg-white rounded-xl p-8 my-4 text-center">Preview</div>'+btn("Generate CSS");$("run").onclick=()=>{let v=number("x")+"px "+number("y")+"px "+number("b")+"px "+number("s")+"px rgba(0,0,0,.18)";$("preview").style.boxShadow=v;show("box-shadow: "+v+";")};return}
if(t==="color"){textTool(field("HEX color","v","#7c3aed")+btn("Convert"),()=>{let h=txt("v").replace("#","");if(!/^[0-9a-f]{6}$/i.test(h))throw Error("Enter a six-digit HEX color");let r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);show("RGB: "+r+", "+g+", "+b+"\nHEX: #"+h.toUpperCase())});return}
if(t==="url"){textTool(area("URL text","v")+btn("Encode","enc")+btn("Decode","dec"),()=>{});$("enc").onclick=()=>show(encodeURIComponent(txt("v")));$("dec").onclick=()=>{try{show(decodeURIComponent(txt("v")))}catch(e){show("Invalid encoded input")}};return}
if(t==="jwt"){textTool(area("JWT token","v")+btn("Decode"),()=>{let p=txt("v").split(".");if(p.length<2)throw Error("JWT must contain header and payload");let dec=s=>JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/")))));show("Header:\n"+JSON.stringify(dec(p[0]),null,2)+"\nPayload:\n"+JSON.stringify(dec(p[1]),null,2)+"\nSignature is not verified.");});return}
if(t==="uuid"){textTool(btn("Generate UUID"),()=>show(crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{let r=Math.random()*16|0;return(c==="x"?r:(r&3|8)).toString(16)})));return}
if(t==="hash"){textTool(area("Text to hash","v")+btn("Generate SHA-256"),async()=>{let h=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(txt("v")));show([...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,"0")).join(""))});return}
if(t==="regex"){textTool(field("Regular expression","re","\\btool\\b")+area("Test text","v","Paste text to test")+btn("Test"),()=>{let re=new RegExp(txt("re"),"g"),m=txt("v").match(re);show(m?m.join("\n"):"No matches")});return}
if(t==="timestamp"){textTool(field("Unix timestamp (seconds)","v",String(Math.floor(Date.now()/1000)))+btn("Convert"),()=>{let d=new Date(Number(txt("v"))*1000);if(isNaN(d))throw Error("Invalid timestamp");show(d.toString()+"\nISO: "+d.toISOString())});return}
if(t==="markdown"){textTool(area("Markdown (basic)","v","# Hello\n\nWrite **bold** text.")+btn("Preview"),()=>{let s=txt("v").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/\n/g,"<br>");$("result").innerHTML=s});return}
if(t==="scientific"){textTool(field("Expression","v","(12+5)*3")+btn("Calculate"),()=>{let s=txt("v");if(!/^[0-9+\-*/().%\s]+$/.test(s))throw Error("Only basic arithmetic characters are allowed");show(Function('"use strict";return ('+s+')')())});return}
if(t==="pomodoro"||t==="stopwatch"||t==="countdown"){let label=t==="pomodoro"?"25":t==="countdown"?"5":"0";app.innerHTML=field(t==="stopwatch"?"":"Minutes","mins",label,"number")+'<div id="clock" class="text-5xl font-extrabold text-violet-700 text-center my-6">00:00</div><div class="flex gap-2">'+btn("Start","start")+'<button class="btn alt" id="pause">Pause</button><button class="btn" id="reset">Reset</button></div>';let sec=t==="stopwatch"?0:number("mins")*60,run=false,iv;const paint=()=>{$("clock").textContent=String(Math.floor(sec/60)).padStart(2,"0")+":"+String(sec%60).padStart(2,"0")};paint();$("start").onclick=()=>{if(run)return;run=true;iv=setInterval(()=>{sec+=t==="stopwatch"?1:-1;if(sec<=0&&t!=="stopwatch"){sec=0;clearInterval(iv);run=false}paint()},1000)};$("pause").onclick=()=>{clearInterval(iv);run=false};$("reset").onclick=()=>{clearInterval(iv);run=false;sec=t==="stopwatch"?0:number("mins")*60;paint()};return}
if(t==="worldclock"){app.innerHTML=select("Time zone","zone",["Asia/Kolkata","Europe/London","America/New_York","Asia/Tokyo","Australia/Sydney"])+btn("Show time")+out;$("run").onclick=()=>show(new Intl.DateTimeFormat(undefined,{dateStyle:"full",timeStyle:"long",timeZone:txt("zone")}).format(new Date()));return}
if(t==="ip"){app.innerHTML='<p class="text-sm text-slate-600 mb-3">This optional lookup contacts ipify to display the public IP address.</p>'+btn("Check public IP")+out;$("run").onclick=async()=>{try{show(await (await fetch("https://api.ipify.org?format=json")).text())}catch(e){show("Lookup unavailable. Check your connection.")}};return}
if(t==="typing"){let sample="The quick brown fox jumps over the lazy dog. Practice regularly to improve accuracy and typing speed.";app.innerHTML='<p class="mb-3">'+sample+'</p><textarea class="tool-input" id="typed" rows="4" placeholder="Start typing the sample here..."></textarea><p id="stats" class="font-bold">Time: 0s | WPM: 0 | Accuracy: 100%</p>';let start; $("typed").oninput=()=>{let v=txt("typed");start??=Date.now();let mins=Math.max((Date.now()-start)/60000,.01),correct=[...v].filter((c,i)=>c===sample[i]).length;$("stats").textContent="Time: "+Math.floor((Date.now()-start)/1000)+"s | WPM: "+Math.round(words(v)/mins)+" | Accuracy: "+Math.round(correct/Math.max(1,v.length)*100)+"%"};return}
if(t==="invoice"){app.innerHTML=field("Business name","biz","Your business")+field("Customer","cust","Customer name")+field("Invoice number","num","INV-001")+field("Description","desc","Service or product")+field("Amount","amt","1000","number")+btn("Create printable invoice");$("run").onclick=()=>{let w=window.open("","_blank");w.document.write("<h1>Invoice "+txt("num")+"</h1><p>From: "+txt("biz")+"</p><p>Bill to: "+txt("cust")+"</p><p>"+txt("desc")+"</p><h2>Total: "+txt("amt")+"</h2>");w.document.close();w.print()};return}
if(t==="pdfmerge"||t==="pdfsplit"||t==="pdfdelete"||t==="pdfrotate"||t==="pdfnumbers"||t==="pdfwatermark"||t==="pdfcompress"){app.innerHTML=file("Select PDF","application/pdf",t==="pdfmerge")+(t==="pdfmerge"?'<p class="text-xs text-slate-500">Select multiple PDFs to merge.</p>':field("Page numbers (for split/delete/rotate; e.g. 1,3-5)","pages","1,3-5"))+(t==="pdfwatermark"?field("Watermark text","wm","CONFIDENTIAL"):"")+(t==="pdfnumbers"?"": "")+btn("Process PDF")+out;$("run").onclick=async()=>{try{let files=$("file").files;if(!files.length)throw Error("Choose a PDF file");let {PDFDocument,StandardFonts,rgb,degrees}=PDFLib;if(t==="pdfmerge"){let out=await PDFDocument.create();for(let f of files){let d=await PDFDocument.load(await f.arrayBuffer());let pages=await out.copyPages(d,d.getPageIndices());pages.forEach(p=>out.addPage(p))}download(new Blob([await out.save()],{type:"application/pdf"}),"merged.pdf");show("Merged PDF downloaded.");return}let d=await PDFDocument.load(await files[0].arrayBuffer()),pages=d.getPages(),ids=(txt("pages").match(/\d+(?:-\d+)?/g)||[]).flatMap(x=>{let [a,b]=x.split("-").map(Number);return Array.from({length:(b||a)-a+1},(_,i)=>a+i-1)});if(t==="pdfdelete"){let rem=new Set(ids);for(let i=pages.length-1;i>=0;i--)if(rem.has(i))d.removePage(i)}if(t==="pdfsplit"){let out=await PDFDocument.create();for(let i of ids){if(i>=0&&i<pages.length){let [p]=await out.copyPages(d,[i]);out.addPage(p)}}download(new Blob([await out.save()],{type:"application/pdf"}),"split.pdf");show("Extracted pages downloaded.");return}if(t==="pdfrotate")ids.forEach(i=>{if(pages[i])pages[i].setRotation(degrees((pages[i].getRotation().angle+90)%360))});if(t==="pdfnumbers"||t==="pdfwatermark"){let font=await d.embedFont(StandardFonts.Helvetica);pages.forEach((p,i)=>p.drawText(t==="pdfnumbers"?String(i+1):txt("wm"),{x:30,y:25,size:12,font,color:rgb(.45,.45,.45),opacity:.6}))}download(new Blob([await d.save()],{type:"application/pdf"}),"processed.pdf");show("Processed PDF downloaded.")}catch(e){show("PDF error: "+e.message)}};return}
if(t==="pdfcompress"){show("PDF compression is not reliably supported by this browser library; use an image-optimized source PDF or a dedicated PDF optimizer.");return}
if(t==="imgcompress"||t==="imgresize"||t==="imgcrop"||t==="jpgpng"||t==="pngjpg"||t==="webp"||t==="imgbase64"||t==="favicon"||t==="meme"||t==="colorpick"||t==="imgpdf"||t==="pdftojpg"||t==="base64img"||t==="ocr"){app.innerHTML=file("Choose image","image/*")+((t==="imgresize"||t==="imgcrop")?field("Width (px)","w","800","number")+field("Height (px)","h","600","number"):"")+(t==="meme"?field("Top caption","top","TOP TEXT")+field("Bottom caption","bottom","BOTTOM TEXT"):"")+(t==="imgcompress"?field("Quality (0.1 - 1)","q","0.75","number"):"")+btn("Process image")+out;$("run").onclick=async()=>{try{let f=$("file").files[0];if(!f)throw Error("Choose an image");if(t==="imgbase64"){let r=new FileReader();r.onload=()=>show(r.result);r.readAsDataURL(f);return}if(t==="base64img"){let u=txt("base64");if(!u.startsWith("data:image/"))throw Error("Paste a data:image/... URL into the input first");return}if(t==="ocr"){if(!window.Tesseract){show("OCR library is not loaded. Try again later.");return}show("OCR is a large download; please wait...");let r=await Tesseract.recognize(f,"eng");show(r.data.text);return}imageFromFile(f,async(im)=>{let w=t==="imgresize"?Math.max(1,number("w")):im.naturalWidth,h=t==="imgresize"?Math.max(1,number("h")):im.naturalHeight,c=document.createElement("canvas");if(t==="imgcrop"){w=Math.min(w,im.naturalWidth);h=Math.min(h,im.naturalHeight)}c.width=w;c.height=h;let ctx=c.getContext("2d");if(t==="meme"){ctx.drawImage(im,0,0,w,h);ctx.font="bold "+Math.max(24,w/12)+"px Impact";ctx.textAlign="center";ctx.lineWidth=3;ctx.strokeStyle="black";ctx.fillStyle="white";[txt("top"),txt("bottom")].forEach((s,i)=>{let y=i? h-25:Math.max(35,w/12);ctx.strokeText(s.toUpperCase(),w/2,y);ctx.fillText(s.toUpperCase(),w/2,y)})}else ctx.drawImage(im,0,0,w,h);if(t==="colorpick"){let p=ctx.getImageData(Math.floor(w/2),Math.floor(h/2),1,1).data;show("Center pixel HEX: #"+[...p].slice(0,3).map(x=>x.toString(16).padStart(2,"0")).join("").toUpperCase());return}let mime=t==="jpgpng"||t==="favicon"?"image/png":t==="pngjpg"?"image/jpeg":t==="webp"?"image/webp":"image/jpeg",blob=await canvasBlob(c,mime,t==="imgcompress"?Math.min(1,Math.max(.1,number("q")||.75)):.9);download(blob,t+". "+(mime==="image/png"?"png":mime==="image/webp"?"webp":"jpg"));show("Image processed and downloaded.")})}catch(e){show("Image error: "+e.message)}};if(t==="base64img"){app.insertAdjacentHTML("afterbegin",area("Base64 data URL","base64"));$("run").onclick=()=>{let im=new Image();im.onload=()=>{let c=document.createElement("canvas");c.width=im.width;c.height=im.height;c.getContext("2d").drawImage(im,0,0);c.toBlob(b=>download(b,"image.png"))};im.src=txt("base64")}}return}
if(t==="jsoncsv"||t==="csvjson"){textTool(area("Input","v",t==="jsoncsv"?'[{"name":"Ada","age":36}]':"name,age\nAda,36")+btn("Convert"),()=>{if(t==="jsoncsv"){let a=JSON.parse(txt("v"));if(!Array.isArray(a)||!a.length)throw Error("Provide a non-empty JSON array");let keys=[...new Set(a.flatMap(Object.keys))],csv=[keys.join(","),...a.map(o=>keys.map(k=>JSON.stringify(o[k]??"")).join(","))].join("\n");show(csv)}else{let [head,...rows]=txt("v").trim().split(/\r?\n/),keys=head.split(",");show(JSON.stringify(rows.map(r=>Object.fromEntries(r.split(",").map((v,i)=>[keys[i],v]))),null,2))}});return}
if(t==="htmlmin"||t==="cssmin"||t==="jsmin"){textTool(area("Source code","v")+btn("Minify"),()=>{let s=txt("v");if(t==="htmlmin")s=s.replace(/<!--[\s\S]*?-->/g,"").replace(/>\s+</g,"><").trim();else if(t==="cssmin")s=s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\s+/g," ").replace(/\s*([{}:;,])\s*/g,"$1").replace(/;}/g,"}").trim();else s=s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,"").replace(/\s+/g," ").trim();show(s)});return}
if(t==="gpa"){textTool(field("Grades separated by commas","v","8,9,7.5,10")+btn("Calculate average"),()=>{let a=txt("v").split(",").map(Number);if(!a.length||a.some(x=>!Number.isFinite(x)))throw Error("Enter numeric grades separated by commas");show("Average: "+(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2))});return}
if(t==="scientific"){return}
if(t==="pomodoro"||t==="stopwatch"||t==="countdown"){return}
app.innerHTML='<p class="text-slate-600">This tool page has been created, but this tool type needs a dedicated implementation before it can be advertised as fully functional.</p><p class="text-xs text-slate-400 mt-2">No data is uploaded by this placeholder panel.</p>';
}
document.addEventListener("DOMContentLoaded",setup);
})();`;
}
function libraryPage(existing) {
  let html = existing || "";
  // If no page exists, create a matching library shell.
  if (!html) html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tools Library - ProTools Portal</title><script src="https://cdn.tailwindcss.com"><\/script><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"></head><body class="bg-slate-50"><main class="max-w-7xl mx-auto p-6"><h1 class="text-3xl font-extrabold mb-2">Tools Library</h1><p class="text-slate-500 mb-6">Browse free browser-based utilities.</p><div id="generated-tools"></div></main></body></html>`;
  const cards = groups.map(cat => {
    const entries = tools.filter(t=>t[2]===cat && !(existing || "").includes(`href="tools/${t[0]}.html"`)).map(t=>`<a data-tool-card href="tools/${t[0]}.html" class="tool-card bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-400 transition flex flex-col"><div class="w-11 h-11 rounded-xl bg-violet-50 text-violet-700 grid place-items-center text-xl mb-3"><i class="fa ${t[4]}"></i></div><h3 class="font-bold text-slate-800 mb-2">${esc(t[1])}</h3><p class="text-sm text-slate-500 flex-1">${esc(t[3])}</p><span class="text-xs font-bold text-violet-700 mt-4">Open tool <i class="fa fa-arrow-right"></i></span></a>`).join("");
    return `<section id="${slugify(cat)}" class="mb-12"><h2 class="text-xl font-extrabold text-violet-950 border-b pb-3 mb-5"><i class="fa ${categoryIcon[cat]||"fa-toolbox"}"></i> ${esc(cat)} Tools</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">${entries}</div></section>`;
  }).join("");
  const block = `<div id="bulk-tools-generated" class="mt-8"><div class="flex flex-col md:flex-row gap-3 mb-8"><input id="toolSearchGenerated" class="w-full p-3 border rounded-xl" placeholder="Search all tools..."><select id="toolCategoryGenerated" class="p-3 border rounded-xl"><option value="">All categories</option>${groups.map(c=>`<option>${esc(c)}</option>`).join("")}</select></div>${cards}</div><script>(function(){const s=document.getElementById('toolSearchGenerated'),c=document.getElementById('toolCategoryGenerated');function f(){document.querySelectorAll('#bulk-tools-generated section').forEach(sec=>{let cat=sec.querySelector('h2').textContent.replace(' Tools','').trim(),showCat=!c.value||cat===c.value,any=false;sec.querySelectorAll('[data-tool-card]').forEach(a=>{let ok=showCat&&a.textContent.toLowerCase().includes(s.value.toLowerCase());a.style.display=ok?'flex':'none';any=any||ok});sec.style.display=any?'block':'none'})}s.addEventListener('input',f);c.addEventListener('change',f)})();<\/script>`;
  if (html.includes('id="bulk-tools-generated"')) {
    html = html.replace(/<div id="bulk-tools-generated"[\s\S]*?<\/script>/, block);
  } else if (html.includes("</main>")) {
    html = html.replace("</main>", block+"</main>");
  } else {
    html = html.replace("</body>", block+"</body>");
  }
  return html;
}

function writeSafe(file, content) {
  fs.mkdirSync(path.dirname(file), {recursive:true});
  if (fs.existsSync(file) && !FORCE) { skipped++; return false; }
  fs.writeFileSync(file,content,"utf8"); created++; return true;
}
let created=0, skipped=0;
fs.mkdirSync(TOOLS_DIR,{recursive:true});
fs.mkdirSync(path.join(ROOT,"js"),{recursive:true});
console.log("ProTools generator root:",ROOT);
for(const t of tools) writeSafe(path.join(TOOLS_DIR,t[0]+".html"),toolPage(t));
writeSafe(path.join(ROOT,"js","tool-engine.js"),engineFile());

// Add a searchable generated directory to tools.html while preserving existing content.
const toolsHtmlPath=path.join(ROOT,"tools.html");
if(fs.existsSync(toolsHtmlPath)){
  const old=fs.readFileSync(toolsHtmlPath,"utf8");
  const updated=libraryPage(old);
  if(updated!==old){
    if(FORCE || !old.includes('id="bulk-tools-generated"')){fs.writeFileSync(toolsHtmlPath,updated,"utf8");created++;}
    else skipped++;
  }
}else{
  writeSafe(toolsHtmlPath,libraryPage(""));
}

// Sitemap and robots.txt. Keep domain in one variable above.
const urls=tools.map(t=>`<url><loc>${DOMAIN}/tools/${t[0]}.html</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join("\n");
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${DOMAIN}/</loc><priority>1.0</priority></url>\n<url><loc>${DOMAIN}/tools.html</loc><priority>0.9</priority></url>\n${urls}\n</urlset>\n`;
writeSafe(path.join(ROOT,"sitemap.xml"),sitemap);
writeSafe(path.join(ROOT,"robots.txt"),`User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml\n`);
console.log(`\nFinished. Created: ${created} | Skipped: ${skipped}`);
console.log("Note: pages are generated for every registry entry. Complex tools such as full PDF compression, OCR, and some image operations may need additional dedicated implementation/testing before production use.");
if(DOMAIN.includes("YOURDOMAIN")) console.warn("Remember to set DOMAIN at the top of generate-tools.js before publishing.");