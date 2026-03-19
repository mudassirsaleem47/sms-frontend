import { ArrowRightToLine } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthLayout({
  title,
  subtitle,
  icon: Icon = ArrowRightToLine,
  children,
  footer,
  badgeText = "School Management",
  maxWidthClass = "max-w-md"
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_#ccecf8_0%,_#edf5f8_45%,_#f8fafc_100%)] px-4 py-8">
      <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-14 bottom-6 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" />

      <div className={cn("relative w-full rounded-[2rem] border border-slate-200/80 bg-white/70 p-3 shadow-[0_20px_60px_-20px_rgba(14,116,144,0.35)] backdrop-blur-xl", maxWidthClass)}>
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-white/80 px-6 py-7 sm:px-7 sm:py-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/70 bg-white shadow-sm">
              <Icon className="h-5 w-5 text-slate-700" />
            </div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">{badgeText}</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
            {subtitle ? <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">{subtitle}</p> : null}
          </div>

          <div
            className={cn(
              "space-y-4",
              "[&_input]:h-11 [&_input]:rounded-xl [&_input]:border-slate-200 [&_input]:bg-slate-50/70",
              "[&_button]:h-11 [&_button]:rounded-xl"
            )}
          >
            {children}
          </div>

          {footer ? <div className="mt-6 border-t border-slate-200/80 pt-4 text-center text-sm text-slate-600">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
