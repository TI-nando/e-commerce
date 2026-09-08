/**
 * Gera um gradiente determinístico a partir de uma string (nome do produto).
 * Mesmo nome sempre produz a mesma cor — não é aleatório a cada render.
 * Isso substitui a necessidade de uma imagem real/API externa de imagens
 * para o placeholder do card de produto.
 */
const HUE_STEP = 47; // primo pequeno, espalha bem as cores no círculo de 360°

export function hashToHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) % 360;
  }
  return (hash * HUE_STEP) % 360;
}

export function gradientFor(input: string): { from: string; to: string } {
  const hue = hashToHue(input || '?');
  return {
    from: `hsl(${hue} 70% 22%)`,
    to: `hsl(${(hue + 40) % 360} 70% 14%)`,
  };
}

export function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}
