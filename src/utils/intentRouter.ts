
export type Intent = 'ABC_LETTERS' | 'MATHS' | 'OTHER';

export function analyzeIntent(message: string, grade: string): Intent {
  const msg = message.toLowerCase().trim();
  
  // Grade check
  const isEarlyGrade = /r|1|2|3/.test(grade.toLowerCase());
  
  // ABC Heuristics
  if (isEarlyGrade && /\b(abc|alphabet|letter|a b c)\b/.test(msg)) {
    return 'ABC_LETTERS';
  }
  
  // Maths Heuristics
  if (/\b(math|sum|plus|minus|add|subtract|calculate|number|equation|solve)\b/.test(msg)) {
    return 'MATHS';
  }
  
  return 'OTHER';
}
