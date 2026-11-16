/** El nombre con su cuadrito canela como punto final. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`marca ${className}`} translate="no">
      Canelia
      <i aria-hidden="true" />
    </span>
  );
}
