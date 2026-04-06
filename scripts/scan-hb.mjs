import fs from 'fs'
const s = fs.readFileSync('.hb-bundle.js', 'utf8')
// Public career / openings paths (URLs starting with / and containing career or opening)
const re = /url:`[^`]*\/[^`]*(career|opening|vacancy|job)[^`]*`/gi
let m
let n = 0
while ((m = re.exec(s)) && n++ < 40) {
  console.log(m[0])
}
