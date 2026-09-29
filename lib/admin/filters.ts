/* Shared list filters. Days are "YYYY-MM-DD" strings (see dayOf in lib/format),
   which compare correctly as plain text. */

export type DateRange = { from: string; to: string } // "" = open end

export const NO_RANGE: DateRange = { from: "", to: "" }

/** Whether a day falls inside the range (both ends included). */
export const inRange = (day: string, { from, to }: DateRange) => (!from || day >= from) && (!to || day <= to)
