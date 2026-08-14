// Le "viseur de repérage" (registration mark) est le petit symbole que les
// imprimeurs utilisent pour aligner les plaques de couleur (CMJN) sur une
// presse. C'est l'élément signature du site : il revient en filigrane pour
// rappeler, discrètement, le métier du client.
export default function RegistrationMark({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={`transition-transform duration-500 group-hover:rotate-90 ${className}`}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="1" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="20" y1="28" x2="20" y2="39" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1" y1="20" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="20" x2="39" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  );
}
