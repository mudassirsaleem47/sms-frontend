import { useTheme } from "@/components/theme-provider"
import { Toaster as Sonner } from "sonner"

const Toaster = ({
  ...props
}) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme === "system" ? undefined : theme}
      position="top-center"
      closeButton
      
      richColors={true}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg rounded-[var(--radius)]",
          description: "group-[.toast]:text-muted-foreground font-sans [&[data-type=success]]:!text-green-700 dark:[&[data-type=success]]:!text-green-300 [&[data-type=error]]:!text-red-700 dark:[&[data-type=error]]:!text-red-300 [&[data-type=warning]]:!text-yellow-700 dark:[&[data-type=warning]]:!text-yellow-300 [&[data-type=info]]:!text-blue-700 dark:[&[data-type=info]]:!text-blue-300",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-sans",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-sans",
          title: "group-[.toast]:text-foreground font-sans [&[data-type=success]]:!text-green-800 dark:[&[data-type=success]]:!text-green-200 [&[data-type=error]]:!text-red-800 dark:[&[data-type=error]]:!text-red-200 [&[data-type=warning]]:!text-yellow-800 dark:[&[data-type=warning]]:!text-yellow-200 [&[data-type=info]]:!text-blue-800 dark:[&[data-type=info]]:!text-blue-200",
          icon: "[&[data-type=success]]:!text-green-600 dark:[&[data-type=success]]:!text-green-400 [&[data-type=error]]:!text-red-600 dark:[&[data-type=error]]:!text-red-400 [&[data-type=warning]]:!text-yellow-600 dark:[&[data-type=warning]]:!text-yellow-400 [&[data-type=info]]:!text-blue-600 dark:[&[data-type=info]]:!text-blue-400",

          
        },
      }}
      {...props} />
  );
}

export { Toaster }
