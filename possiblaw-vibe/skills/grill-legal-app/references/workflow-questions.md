# Workflow Questions

Workflows are the procedural skeleton of a legal practice. Walk these in lifecycle order: intake -> conflict -> engagement -> work -> close-out.

## Matter intake

- How does a prospect arrive? (web form, referral, phone, walk-in)
- What information is captured at intake? (name, contact, opposing party, brief description, jurisdiction, urgency)
- Does intake automatically trigger a conflict check?
  - Recommend: yes, always, before any substantive engagement.
- Intake form per practice area or universal?

## Conflict check

- Manual lookup against a client list, automated DB scan, or hybrid?
  - Recommend: automated scan against `clients`, `adverse_parties`, `related_entities`, with a human attorney sign-off step before clearing.
- Fuzzy matching on names? (yes -- "Acme Corp" should hit "Acme Corporation")
- Adverse party tracking (not just clients but everyone the firm has ever been adverse to)?
- Ethics walls -- if a conflict is clearable with screening, how is the wall enforced in the app? (per-user matter ACL deny)
- Conflict report archived per matter forever?
- Recommend: store the conflict report, the cleared-by attorney, and the timestamp on the matter record.

## Engagement

- Engagement letter generated from template?
- Does it require client signature before work proceeds? (recommend yes, always)
- Fee structure captured at engagement (hourly, flat, contingency, hybrid)?
- Trust deposit required up front?
- Recommend: matter cannot leave `pending_engagement` state until engagement letter is signed and (if applicable) trust deposit clears.

## Onboarding

- Client portal access provisioned at engagement?
- Welcome packet, intake questionnaire, document requests?
- Recurring tasks created (initial filings, statute-of-limitations alarm)?

## Document review cycles

- Who reviews, in what order? (paralegal drafts -> associate reviews -> partner approves)
- How are reviewers assigned? (round-robin, manual, by matter team)
- Deadlines on each review step?
- Escalation if a reviewer misses a deadline? (auto-reassign? notify supervisor?)
- Recommend: review queue per user with overdue flags; daily digest email; escalation to supervisor at 2x deadline.

## Approval chains

- Single approver, multi-step, or partner sign-off?
- Different chains for different document types? (engagement letters always partner; routine correspondence single attorney)
- Override / emergency approval path?

## Deadline tracking

- Statute of limitations per matter type?
- Court deadlines per filing? (FRCP, state rules of civil procedure -- jurisdiction-specific)
- Contractual deadlines (notice periods, performance dates)?
- Internal deadlines (review by, send by)?
- Computation transparency -- never display a deadline without showing the rule and the math.
  - Example: "Answer due 2026-05-19 (FRCP 12(a)(1)(A)(i): 21 days after service on 2026-04-28)."
- Holiday and weekend adjustment per jurisdiction?
- Reminder cadence: 30/14/7/3/1 day default; user-configurable.
- Hard alarms (in-app + email + SMS) at 3 days and 1 day for court deadlines.

## Conflict re-checks

- Re-run conflict check when adding a new party to an existing matter?
- Re-run when opening a related matter?
- Recommend: yes to both, plus an annual sweep across active matters.

## Time tracking and billing

- Time entries per matter, per task code (ABA UTBMS codes)?
- Timer in-app or batch entry at end of day?
- Pre-bill review by attorney before invoice goes out?
- LEDES invoice format for corporate clients?
- Trust draw-down invoicing (deduct from trust, notify client, replenish)?
- Recommend: skip native billing if integrating with Clio/MyCase. Build only what those don't cover.

## Trust accounting / IOLTA

- Pooled trust account with per-client sub-ledgers?
- Three-way reconciliation (bank statement, trust ledger, client ledger) -- monthly minimum.
- Never commingle. Never let a client sub-ledger go negative.
- Most jurisdictions require IOLTA reporting to the bar.
- Recommend: integrate with LawPay or a dedicated IOLTA tool rather than building from scratch. Trust accounting bugs lose bar licenses.

## E-filing

- Federal CM/ECF (PACER) filings?
- State court e-filing -- which jurisdictions? (each state has its own EFM or no EFM)
- Third-party EFM integration (One Legal, File & ServeXpress)?
- Filing receipt captured back into the matter?

## Service of process

- Track when service was effected? (kicks off all the response deadlines)
- Affidavit of service stored with the matter?
- Service on multiple parties tracked separately?

## Matter close-out

- Close-out checklist: final invoice, trust refund, file delivery to client, retention clock starts.
- Close-out triggers archive of the matter and freezes edits.
- Reopen permitted only by partner with audit reason.
