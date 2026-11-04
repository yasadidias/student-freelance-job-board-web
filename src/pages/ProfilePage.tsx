import { useState } from "react"
import type { FormEvent } from "react"
import Alert from "../components/Alert"
import AvailabilityGrid from "../components/AvailabilityGrid"
import { getErrorMessage } from "../services/api"
import { userService } from "../services/userService"
import { setUser } from "../store/authSlice"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import type { AvailabilitySlot } from "../types"

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const [name, setName] = useState(user?.name ?? "")
  const [slots, setSlots] = useState<AvailabilitySlot[]>(user?.availability ?? [])
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savingName, setSavingName] = useState(false)
  const [savingSlots, setSavingSlots] = useState(false)

  if (!user) return null

  const saveName = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setSavingName(true)
    setMessage(null)
    setError(null)
    try {
      const updated = await userService.updateName(name.trim())
      dispatch(setUser(updated))
      setMessage("Name updated")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSavingName(false)
    }
  }

  const saveSlots = async (): Promise<void> => {
    setSavingSlots(true)
    setMessage(null)
    setError(null)
    try {
      const updated = await userService.saveAvailability(slots)
      dispatch(setUser(updated))
      setMessage("Your free times were saved")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSavingSlots(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">My profile</h1>
      <Alert type="success" message={message} />
      <Alert message={error} />

      <form onSubmit={saveName} className="card space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="input"
            value={name}
            minLength={2}
            maxLength={60}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <p className="text-sm text-slate-500">
          Email: {user.email} &middot; Role: {user.role}
        </p>
        <button className="btn-primary" disabled={savingName}>
          {savingName ? "Saving..." : "Save name"}
        </button>
      </form>

      {user.role === "USER" && (
        <section className="card">
          <h2 className="text-lg font-semibold">My weekly free times</h2>
          <p className="mb-4 text-sm text-slate-500">
            Click an hour, or press and drag across several hours, to mark when you are free. Clients see this when
            they review your application. Click a day name to select the whole day.
          </p>
          <AvailabilityGrid value={slots} onChange={setSlots} />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="btn-primary" onClick={saveSlots} disabled={savingSlots}>
              {savingSlots ? "Saving..." : "Save free times"}
            </button>
            <button className="btn-secondary" onClick={() => setSlots([])}>
              Clear all
            </button>
            <span className="text-xs text-slate-500">{slots.length} hours selected</span>
          </div>
        </section>
      )}
    </div>
  )
}