import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const handleToggle = (checked) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center gap-2">
      {!isDark && <Sun />}
      {isDark && <Moon />}
      Dark Mode
      <Switch
        checked={isDark}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
    </div>
  )
}
