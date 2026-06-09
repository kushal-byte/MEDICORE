export function Card({ className = '', children }) {
  return <div className={`glass glass-hover p-5 ${className}`}>{children}</div>
}
