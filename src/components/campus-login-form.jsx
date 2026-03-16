import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Building2 } from "lucide-react"

export function CampusLoginForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  const { staffLogin, loading, error } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    const credentials = { email, password }
    
    try {
      const userData = await staffLogin(credentials)
      // Check for Principal designation
      if (userData.designation?.toLowerCase() === "principal") {
        navigate("/admin/dashboard")
      } else {
        setLocalError("Access Denied: This portal is for Campus Principals.")
      }
    } catch (err) {
      setLocalError(error || "Invalid credentials or Server error.")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2 border-primary/10 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Campus Login</CardTitle>
          <CardDescription>
            Login to your specific branch dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              {localError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4" />
                  {localError}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Campus Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="principal@branch.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 shadow-sm"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold mt-2 shadow-lg hover:shadow-primary/20 transition-all" disabled={loading}>
                {loading ? "Verifying..." : "Login as Principal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
