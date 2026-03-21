'use client'
interface SaveButtonProps { saved: boolean; onToggle: () => void }
export function SaveButton({ saved, onToggle }: SaveButtonProps) {
  return (
    <button onClick={onToggle} aria-label={saved ? 'Unsave' : 'Save'}
      className={`text-xl transition ${saved ? 'text-white' : 'text-blade-steel'}`}>
      {saved ? '🔖' : '📑'}
    </button>
  )
}
