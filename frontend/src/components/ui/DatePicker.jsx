import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Reusable DatePicker component using Shadcn Calendar + Popover.
 *
 * @param {string} value        - Current date value as "YYYY-MM-DD" string
 * @param {function} onChange   - Callback: called with "YYYY-MM-DD" string (or "" if cleared)
 * @param {string} placeholder  - Placeholder text when no date selected
 * @param {boolean} required    - Whether the field is required
 * @param {string} id           - Optional id for the trigger button
 * @param {string} className    - Optional extra className for the trigger button
 */
const DatePicker = ({
    value,
    onChange,
    placeholder = "Pick a date",
    // eslint-disable-next-line no-unused-vars
    required = false,
    id,
    className,
}) => {
    const [open, setOpen] = React.useState(false);

    // Parse incoming string value to Date object
    const selectedDate = React.useMemo(() => {
        if (!value) return undefined;
        try {
            // Handle both "YYYY-MM-DD" and ISO string formats
            const parsed = value.includes("T") ? parseISO(value) : new Date(value + "T00:00:00");
            return isValid(parsed) ? parsed : undefined;
        } catch {
            return undefined;
        }
    }, [value]);

    const handleSelect = (date) => {
        if (date) {
            // Always return as "YYYY-MM-DD" string for backend compatibility
            onChange(format(date, "yyyy-MM-dd"));
        } else {
            onChange("");
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                        className
                    )}
                    type="button"
                >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    {selectedDate ? (
                        format(selectedDate, "PPP")
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};

export { DatePicker };
