import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

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
    const [inputValue, setInputValue] = React.useState("");

    // Parse incoming string value to Date object for the Calendar
    const selectedDate = React.useMemo(() => {
        if (!value) return undefined;
        try {
            const parsed = value.includes("T") ? parseISO(value) : new Date(value + "T00:00:00");
            return isValid(parsed) ? parsed : undefined;
        } catch {
            return undefined;
        }
    }, [value]);

    // Keep input field synced with current value
    React.useEffect(() => {
        if (value) {
            try {
                const parsed = value.includes("T") ? parseISO(value) : new Date(value + "T00:00:00");
                if (isValid(parsed)) {
                    setInputValue(format(parsed, "yyyy-MM-dd"));
                }
            } catch {
                setInputValue(value);
            }
        } else {
            setInputValue("");
        }
    }, [value]);

    const handleSelect = (date) => {
        if (date) {
            const formatted = format(date, "yyyy-MM-dd");
            onChange(formatted);
            setInputValue(formatted);
        } else {
            onChange("");
            setInputValue("");
        }
        setOpen(false);
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        // If it's a valid date string (YYYY-MM-DD), update the parent state
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            const date = new Date(val + "T00:00:00");
            if (isValid(date)) {
                onChange(val);
            }
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full group">
                    <Input
                        id={id}
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder || "YYYY-MM-DD"}
                        className={cn(
                            "w-full pr-10 font-normal",
                            !value && "text-muted-foreground",
                            className
                        )}
                        autoComplete="off"
                    />
                    <div 
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => setOpen(!open)}
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </div>
                </div>
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
