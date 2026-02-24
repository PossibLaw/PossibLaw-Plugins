#!/usr/bin/env node
// Temporary script to validate EFTS response schema.
// Delete after confirming field names.

const url = `https://efts.sec.gov/LATEST/search-index?q=%22indemnification%22&forms=EX-10&dateRange=custom&startdt=2023-01-01&enddt=2025-12-31`;

const res = await fetch(url, {
  headers: {
    "User-Agent": "PossibLawLegalSkills/1.3.2 (contact: support@possiblaw.com)",
    Accept: "application/json",
  },
});

console.log("Status:", res.status);
console.log("Content-Type:", res.headers.get("content-type"));

const body = await res.text();

try {
  const data = JSON.parse(body);
  console.log("\nTop-level keys:", Object.keys(data));

  if (data.hits) {
    console.log("hits keys:", Object.keys(data.hits));
    console.log("hits.total:", JSON.stringify(data.hits.total));

    if (data.hits.hits && data.hits.hits.length > 0) {
      const first = data.hits.hits[0];
      console.log("\nFirst hit keys:", Object.keys(first));
      console.log("_id:", first._id);
      console.log("_source keys:", first._source ? Object.keys(first._source) : "N/A");

      if (first._source) {
        const s = first._source;
        console.log("\n_source sample:");
        console.log("  display_names:", JSON.stringify(s.display_names));
        console.log("  entity_name:", s.entity_name);
        console.log("  company_name:", s.company_name);
        console.log("  file_date:", s.file_date);
        console.log("  period_of_report:", s.period_of_report);
        console.log("  form_type:", s.form_type);
        console.log("  file_num:", s.file_num);
        console.log("  file_name:", s.file_name);
        console.log("  accession_no:", s.accession_no);
        console.log("  display_date_filed:", s.display_date_filed);
      }

      if (first.highlight) {
        console.log("\nhighlight keys:", Object.keys(first.highlight));
        const hlKeys = Object.keys(first.highlight);
        for (const k of hlKeys.slice(0, 2)) {
          const val = first.highlight[k];
          console.log(`  ${k} (first):`, Array.isArray(val) ? val[0]?.slice(0, 200) : String(val).slice(0, 200));
        }
      }
    }
  }
} catch (e) {
  console.log("Raw response (first 1000 chars):", body.slice(0, 1000));
}
