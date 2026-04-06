import fs from 'fs'
const s = fs.readFileSync('.hb-bundle.js', 'utf8')
const re = /hb\/opening[^\"']{0,60}/g
let m,
  n = 0
while ((m = re.exec(s)) && n++ < 30) console.log(m[0])
