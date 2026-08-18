export function AulaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Arch — the "hall" of aula */}
      <path
        d="M5 28V15a11 11 0 0 1 22 0v13"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M11 28v-9a5 5 0 0 1 10 0v9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="8.5" r="1.9" fill="currentColor" />
    </svg>
  )
}
