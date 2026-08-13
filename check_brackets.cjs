const fs = require('fs');
const content = fs.readFileSync('src/components/spk/SpkFormView.tsx', 'utf8');

let stack = [];
let line = 1;
let col = 1;
let inString = null;
let inComment = null;
let inRegex = false;

for (let i = 0; i < content.length; i++) {
  let char = content[i];
  let nextChar = content[i + 1];

  if (inComment === 'line') {
    if (char === '\n') {
      inComment = null;
      line++;
      col = 1;
    } else {
      col++;
    }
    continue;
  }

  if (inComment === 'block') {
    if (char === '*' && nextChar === '/') {
      inComment = null;
      i++;
      col += 2;
    } else if (char === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }
    continue;
  }

  if (inString) {
    if (char === inString && content[i - 1] !== '\\') {
      inString = null;
    } else if (char === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }
    continue;
  }

  if (char === '/' && nextChar === '/') {
    inComment = 'line';
    i++;
    continue;
  }

  if (char === '/' && nextChar === '*') {
    inComment = 'block';
    i++;
    continue;
  }

  if (char === '"' || char === "'" || char === '`') {
    inString = char;
    col++;
    continue;
  }

  if (char === '(' || char === '[' || char === '{') {
    stack.push({ char, line, col });
  } else if (char === ')' || char === ']' || char === '}') {
    let last = stack.pop();
    let expected = char === ')' ? '(' : char === ']' ? '[' : '{';
    if (!last || last.char !== expected) {
      console.log(`Mismatch: found ${char} at line ${line}:${col}, but expected ${expected} (last was ${last ? last.char : 'none'} at ${last ? last.line + ':' + last.col : 'N/A'})`);
    }
  }

  if (char === '\n') {
    line++;
    col = 1;
  } else {
    col++;
  }
}

if (stack.length > 0) {
  console.log('Unclosed brackets:');
  stack.forEach(s => console.log(`${s.char} at ${s.line}:${s.col}`));
} else {
  console.log('All brackets balanced');
}
