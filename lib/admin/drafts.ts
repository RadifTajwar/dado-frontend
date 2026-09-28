/* Starting-point emails for the admin's "Email" buttons. The admin edits them
   freely before sending; the API wraps the text in the branded template. */

import { DISCIPLINES, SITE } from "@/lib/site"
import type { Contact, Trial } from "@/lib/types"

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "there"

const signature = `Best,
DADO Post-Production
${SITE.email}`

export function trialDraft(t: Trial) {
  const needs = t.services.map((d) => DISCIPLINES[d].label.toLowerCase()).join(" and ") || "trial"
  return {
    subject: `Your DADO trial — ${needs} files received`,
    body: `Hi ${firstName(t.name)},

Thanks for sending your files over — we have opened the link and everything came through.

We are starting on the ${needs} work now and you will have the finished files back within 24 hours (48 for video). No watermark, full resolution, exactly as a paying client receives them.

One thing before we begin: if you have a reference image, a style guide or a naming convention you want us to follow, reply with it and we will build the trial to match.

Nothing to pay either way.

${signature}`,
  }
}

export function contactDraft(c: Contact) {
  const about = c.service ? ` about ${c.service.toLowerCase()}` : ""
  return {
    subject: c.service ? `Re: ${c.service} — DADO` : "Re: your message — DADO",
    body: `Hi ${firstName(c.name)},

Thanks for getting in touch${about}.

Short answer: yes, that is squarely what we do, and the volumes you describe are comfortable for us. Standard turnaround is 24 hours for photo and voice, 48 for video, and our full price list is public so you can budget before committing to anything.

The fastest way to judge us is the free trial — send a link to five files (Drive, Dropbox, WeTransfer, whatever you already use) and you will have them back tomorrow at full resolution, no watermark and no card.

Happy to answer anything else first.

${signature}`,
  }
}
