# Meta recruitment campaign — paste sheet

Everything below is ready to copy straight into Ads Manager.
Campaign `STIQ · Recruitment · Sep26` is already built and sitting in draft.

---

## 1 · What's already done

| Level | Setting | Value |
|---|---|---|
| Campaign | Name | STIQ · Recruitment · Sep26 |
| Campaign | Objective | Leads |
| Campaign | Special Ad Category | **Employment** — United States |
| Campaign | Budget strategy | Ad set budget (not Advantage+ campaign budget) |
| Campaign | A/B test | Off |
| Ad set | Name | AS-1 · Preparers · 5 seats · Detroit |
| Ad set | Conversion location | Instant forms |
| Ad set | Facebook Page | smarttaxiq |
| Ad set | Instagram | smart.taxiq |
| Ad set | Location | Detroit, Michigan + 40 km |
| Ad set | Age / gender | 18–65+ / All (locked by Employment category) |
| Ad set | Placements | Advantage+ (automatic) |
| Ad | Name | Ad A · Remote preparers |

---

## 2 · Budget

Daily budget field, ad set level:

```
34300
```

₦34,300/day ≈ $25/day at ~₦1,372 to the dollar. The account bills in Naira and
resets on Lagos time, so the daily spend rolls over at 00:00 GMT+1, not Detroit
midnight.

---

## 3 · Creative

Meta caps feed images at **4:5** — no 9:16. Every file below is 1:1 or 4:5.
All of them are in `smarttaxiq-nextjs\ad-creative\` on your machine.

Upload path: Ad level → Ad creative → Set up creative → Image ad → Upload.
Upload both ratios per ad and Meta picks the right one per placement.

### Graphics (the set you asked for)

| File | Use it for | The hook |
|---|---|---|
| `g1-remote-1x1` / `-4x5` | Ad A · Remote | Big gold **3**, "REMOTE TAX PREPARERS" |
| `g1-office-1x1` / `-4x5` | Ad B · In-office | Big gold **2**, "IN-OFFICE TAX PREPARERS" |
| `g2-noexp-1x1` / `-4x5` | Either | "You don't need experience" + three ticks |
| `g3-deadline-1x1` / `-4x5` | Either | "OCT 1" — urgency |

Built in the site's own palette (ink `#081840`, gold `#d8b038`, mint `#10a878`)
and Inter, the site's body typeface.

### Photos (the earlier set, still available)

`adA-remote-1x1` / `-4x5` — Lashanda at the laptop
`adB-office-1x1` / `-4x5` — Lashanda, branded polo

Worth knowing: in local hiring ads a real face usually beats a graphic, because
it signals a real employer rather than an agency. You now have both sets, so if
the budget stretches, run one graphic against one photo and let Meta settle it
rather than either of us guessing. If you only run one, `g1` is the strongest
graphic and the photo is the strongest photo.

## 4 · Ad A · Remote preparers

**Primary text**

```
We're training 3 remote tax preparers for the 2027 season. You don't need experience. You do need to finish the training.

Smart Tax IQ — the tax division of Carter Cole & Associates LLC, preparing returns in Detroit since 2003 — is taking on a second location and needs preparers to work it.

Here's the honest version:

• Training starts October 1 and runs ten weeks, online and self-paced
• You study around your own schedule — evenings, weekends, whenever
• You must pass the final exam in December to get a seat in January
• Season runs January through April. 1099, paid per return
• We cover the training. You cover the effort

If you've done returns before and have clients who follow you, even better — we'll talk about that.

If you're looking for something you can half-finish, this isn't it. We're putting five people in front of real clients and their real money.

Apply below. Takes two minutes.
```

**Headline**

```
Get trained as a tax preparer. Work the season from home.
```

**Description**

```
10-week online training starts Oct 1 · 3 remote positions
```

**Call to action:** Apply now

---

## 5 · Ad B · In-office preparers

Duplicate Ad A, rename to `Ad B · In-office preparers`, swap the images and text.

**Primary text**

```
2 seats in our Detroit office this tax season. Busy, in person, and you won't be figuring it out alone.

Smart Tax IQ — the tax division of Carter Cole & Associates LLC — is opening a second Detroit location for the 2027 season. Clients walk in. You won't be hunting for work.

What it actually looks like:

• Training starts October 1, ten weeks, worked through together at the office
• Somebody experienced is next to you while you learn, not on the other end of an email
• You must pass the final exam in December to work the season
• January to April, in the office, at pace. 1099, paid per return
• Walk-in clients, returning clients, deadlines that don't move

This suits someone who'd rather learn by doing it than by watching a video, and who is steady when the waiting room is full.

Experience and an existing client base are a plus, not a requirement.

Apply below — two minutes.
```

**Headline**

```
Tax preparer wanted — Detroit office, training provided
```

**Description**

```
Training starts Oct 1 · 2 in-office positions · Jan–Apr season
```

**Call to action:** Apply now

---

## 6 · The Instant Form

One form, shared by both ads. Ad level → Instant form → Create form.

- **Form name:** `STIQ Preparer Application Sep26`
- **Form type:** More volume *(not Higher intent — the review step adds friction and the five questions already filter)*
- **Contact fields:** Full name · Email · Phone number
- **Privacy policy URL:** `https://smarttaxiq.com/privacy`
- **Field sharing:** Restricted — off

**Intro screen**

Headline:

```
Before you apply — the three things that matter
```

Body:

```
1. Training runs 10 weeks from October 1. It's free, but you have to finish it.
2. You must pass the final exam in December to work the season.
3. The season is January to April. This is 1099 contract work, paid per return.

If all three work for you, the next bit takes two minutes.
```

**The five questions** — in this order, all multiple choice. Don't add a sixth;
every extra question costs applicants.

| # | Question | Options |
|---|---|---|
| 1 | Can you complete a 10-week training programme starting October 1, 2026? | Yes / No |
| 2 | Are you available to work January through April 2027? | Yes / No |
| 3 | Have you prepared tax returns for other people before? | Never / 1–2 seasons / 3+ seasons |
| 4 | Do you currently have a PTIN? | Yes / No / I don't know |
| 5 | This is 1099 contract work paid per return. Is that what you're looking for? | Yes / No |

A "no" on 1, 2 or 5 is an automatic decline. Question 4 is information, not a
filter — "I don't know" is the expected answer and perfectly fine.

**Completion screen**

Headline:

```
Got it — thank you.
```

Body:

```
We read every application. If it looks like a fit, someone will call you within one business day, so keep an eye out for a Detroit number.

Questions in the meantime? Call 313-771-4400.
```

Button text: `Call us`
Button link: `tel:+13137714400`

---

## 7 · Before you publish — catching the leads

Meta keeps Instant Form leads downloadable for about **90 days**, then they drop
out of the interface. Ninety days from now is late December, the middle of the
Academy. Set this up on day one, not in January.

1. **Instant notifications** — Page → Settings → Notifications, and the Meta
   Business Suite app on Lashanda's phone. A recruitment lead goes cold in
   hours.
2. **Automatic export** — Meta now offers native Google Sheets delivery on the
   ad's lead settings (Ad level → lead delivery → Google Sheets → Set up). That
   didn't exist when the runbook was written and it's simpler than Zapier. It
   needs you to authorise the Google account.
3. **Manual daily download as backstop** — Page → Leads Center → Forms library →
   Download. Once a day until the campaign closes, even with automation running.

---

## 8 · Housekeeping

- There's a stale placeholder Instant Form on the account from 22 January 2026.
  Archive it so nobody picks it by accident.
- The ad account hasn't confirmed its business details yet — Ads Manager shows
  "Get set up to run ads". That has to clear before Publish will work.
- Delete or gitignore `smarttaxiq-nextjs\ad-creative\` when you're done; it's
  only there because the browser extension can only upload from your own disk.
