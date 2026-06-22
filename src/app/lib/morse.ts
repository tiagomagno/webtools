// Código Morse — encode/decode para ferramenta #76.

const MAP: Record<string, string> = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..',
  J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.', Q:'--.-',
  R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-', ',':'--..--', '?':'..--..', '!':'-.-.--',
  '-':'-....-', '/':'-..-.', '(':'-.--.', ')':'-.--.-', '&':'.-...', ':':'---...',
  ';':'-.-.-.', '=':'-...-', '+':'.-.-.', '"':'.-..-.', '@':'.--.-.', "'":'.----.',
};

const REV = Object.fromEntries(Object.entries(MAP).map(([k,v]) => [v,k]));

export function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => {
    if (c === ' ') return '/';
    return MAP[c] ?? '?';
  }).join(' ');
}

export function morseToText(morse: string): string {
  return morse.trim().split(/\s*\/\s*/).map(word =>
    word.trim().split(/\s+/).map(code => REV[code] ?? '?').join('')
  ).join(' ');
}
