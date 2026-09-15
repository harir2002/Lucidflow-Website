const fs = require("fs");
const path = require("path");

const objects = [];

function add(content) {
  objects.push(Buffer.from(content, "latin1"));
}

add("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
add("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
add(
  "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
);

const stream = [
  "BT",
  "/F1 20 Tf",
  "72 720 Td",
  "(LucidFlow Journey Assurance Scan) Tj",
  "0 -26 Td",
  "/F1 11 Tf",
  "(By SBA Info Solutions) Tj",
  "0 -32 Td",
  "(A focused, evidence-led review of one agreed journey) Tj",
  "0 -16 Td",
  "(and up to two representative pages or screens.) Tj",
  "0 -28 Td",
  "(What's included) Tj",
  "0 -18 Td",
  "(- Potential findings register) Tj",
  "0 -16 Td",
  "(- Screenshot and journey evidence) Tj",
  "0 -16 Td",
  "(- Severity context) Tj",
  "0 -16 Td",
  "(- CAP template) Tj",
  "0 -16 Td",
  "(- SBA walkthrough) Tj",
  "0 -28 Td",
  "(Boundary: not a legal opinion, regulatory certification,) Tj",
  "0 -16 Td",
  "(or full enterprise audit.) Tj",
  "0 -32 Td",
  "(Contact sales@sbainfo.in or +91 95001 37169) Tj",
  "ET",
].join("\n");

add(`4 0 obj\n<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream\nendobj\n`);
add("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n");

let pdf = Buffer.from("%PDF-1.4\n", "latin1");
const offsets = [0];

for (const object of objects) {
  offsets.push(pdf.length);
  pdf = Buffer.concat([pdf, object]);
}

let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i += 1) {
  xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}

const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${pdf.length}\n%%EOF\n`;
const output = Buffer.concat([pdf, Buffer.from(xref, "latin1"), Buffer.from(trailer, "latin1")]);
const target = path.join(__dirname, "..", "public", "journey-assurance-scan-overview.pdf");

fs.writeFileSync(target, output);
console.log(`Wrote ${target} (${output.length} bytes)`);
