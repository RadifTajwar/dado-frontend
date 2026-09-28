// Self-check for the admin's money maths and pagination.
// Run from frontend/:  node lib/admin/checks.mjs   (Node 22.18+ runs .ts imports directly)
import assert from "node:assert/strict"

import { cents, financeByClient, monthsBetween, percent, sumJobs } from "./finance.ts"
import { pageWindow } from "./pagination.ts"

const job = (clientId, amount, paid) => ({ clientId, amount, paid })

// floating-point sums come back as clean cents
assert.deepEqual(sumJobs([job("a", 0.1, 0.1), job("a", 0.2, 0)]), { billed: 0.3, paid: 0.1, due: 0.2, count: 2 })
assert.equal(cents(0.1 + 0.2), 0.3)
assert.equal(cents(416 - 415.99), 0.01)

const byClient = financeByClient([job("a", 100, 40), job("b", 50, 50), job("a", 20, 0)])
assert.deepEqual(byClient.get("a"), { billed: 120, paid: 40, due: 80, count: 2 })
assert.deepEqual(byClient.get("b"), { billed: 50, paid: 50, due: 0, count: 1 })

assert.equal(percent(1, 3), 33)
assert.equal(percent(5, 0), 0) // nothing billed yet → 0%, not NaN

// the monthly chart gets every month in the range, across a year boundary
assert.deepEqual(monthsBetween("2025-11", "2026-02"), ["2025-11", "2025-12", "2026-01", "2026-02"])
assert.deepEqual(monthsBetween("2026-03", "2026-03"), ["2026-03"])
assert.equal(monthsBetween("2020-01", "2026-12").length, 84)

assert.deepEqual(pageWindow(1, 1), [])
assert.deepEqual(pageWindow(1, 5), [1, 2, 3, 4, 5])
assert.deepEqual(pageWindow(1, 12), [1, 2, 3, 4, "gap", 12])
assert.deepEqual(pageWindow(6, 12), [1, "gap", 5, 6, 7, "gap", 12])
assert.deepEqual(pageWindow(12, 12), [1, "gap", 9, 10, 11, 12])

console.log("admin checks passed")
