interface AlertProps {
  type?: "error" | "success" | "info"
  message: string | null
}

const styles = {
  error: "border-red-600 bg-red-50 text-red-900",
  success: "border-emerald-600 bg-emerald-50 text-emerald-900",
  info: "border-brand bg-brand-soft text-ink",
}

export default function Alert({ type = "error", message }: AlertProps) {
  if (!message) return null
  return (
    <div role="alert" className={`mb-4 rounded-md border-l-4 px-4 py-3 text-sm ${styles[type]}`}>
      {message}
    </div>
  )
}