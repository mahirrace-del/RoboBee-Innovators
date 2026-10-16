const fs = require('fs');
const lines = fs.readFileSync('src/lib/curriculumData.ts', 'utf8').split('\n');
lines.forEach((l, i) => {
  const m = l.match(/id:\s*['"](int-0[6-9]|int-10|adv-[0-9]{2})['"]/);
  if (m) console.log(`${i + 1}: ${m[1]}`);
});
