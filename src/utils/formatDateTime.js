/**
 * Get regional preferences from localStorage.
 * Falls back to sensible defaults if nothing is stored.
 */
function getPreferences() {
    try {
        const raw = localStorage.getItem('sms_appPreferences');
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return {
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Asia/Karachi',
        timeFormat: '12h',
    };
}

/**
 * Check if a Date object was stored as a "date-only" value.
 * Date-only values are stored as midnight UTC (T00:00:00.000Z) in MongoDB.
 * We detect this so we can skip displaying a meaningless time component.
 */
function isDateOnly(date) {
    return date.getUTCHours() === 0 &&
           date.getUTCMinutes() === 0 &&
           date.getUTCSeconds() === 0 &&
           date.getUTCMilliseconds() === 0;
}

/**
 * Format a date value using regional settings from localStorage.
 *
 * Output examples (depending on settings):
 *   DD/MM/YYYY  → "12/02/2026 · 4:30 PM"
 *   MM/DD/YYYY  → "02/12/2026 · 4:30 PM"
 *   YYYY-MM-DD  → "2026-02-12 · 4:30 PM"
 *   MMM DD, YYYY → "Feb 12, 2026 · 4:30 PM"
 *
 * If the stored date has no meaningful time (midnight UTC), only the date is shown.
 *
 * @param {string|Date} dateValue  - The date string or Date object to format
 * @param {object}      options    - Optional configuration
 * @param {boolean}     options.dateOnly - If true, always show only date without time
 * @returns {string} Formatted date/time string or '-' if invalid
 */
export function formatDateTime(dateValue, { dateOnly = false } = {}) {
    if (!dateValue) return '-';

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '-';

        const prefs = getPreferences();
        const tz = prefs.timezone || 'Asia/Karachi';
        const fmt = prefs.dateFormat || 'DD/MM/YYYY';
        const is24 = prefs.timeFormat === '24h';

        // --- Build the date part ---
        let datePart;

        if (fmt === 'MMM DD, YYYY') {
            datePart = date.toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric', timeZone: tz,
            });
        } else {
            // Get individual parts in the correct timezone
            const parts = new Intl.DateTimeFormat('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit', timeZone: tz,
            }).formatToParts(date);

            const dd = parts.find(p => p.type === 'day').value;
            const mm = parts.find(p => p.type === 'month').value;
            const yyyy = parts.find(p => p.type === 'year').value;

            switch (fmt) {
                case 'MM/DD/YYYY': datePart = `${mm}/${dd}/${yyyy}`; break;
                case 'YYYY-MM-DD': datePart = `${yyyy}-${mm}-${dd}`; break;
                case 'DD/MM/YYYY':
                default:           datePart = `${dd}/${mm}/${yyyy}`; break;
            }
        }

        // Skip time if dateOnly requested OR if the stored value has no meaningful time
        if (dateOnly || isDateOnly(date)) return datePart;

        // --- Build the time part ---
        const timePart = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: !is24,
            timeZone: tz,
        });

        return `${datePart} · ${timePart}`;
    } catch {
        return '-';
    }
}
