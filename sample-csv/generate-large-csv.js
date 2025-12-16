import fs from "fs";

const TOTAL_ROWS = 20000; // bisa ganti 10000 / 50000
const outputFile = "employees-large.csv";

const positions = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "UI/UX Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Project Manager",
];

const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

let csv = "name,age,position,salary\n";

for (let i = 1; i <= TOTAL_ROWS; i++) {
  const name = `Employee ${i}`;
  const age = random(20, 50);
  const position = positions[random(0, positions.length - 1)];
  const salary = random(4000000, 15000000);

  csv += `${name},${age},${position},${salary}\n`;
}

fs.writeFileSync(outputFile, csv);

console.log(`✅ CSV berhasil dibuat: ${outputFile}`);
console.log(`📦 Total data: ${TOTAL_ROWS}`);
