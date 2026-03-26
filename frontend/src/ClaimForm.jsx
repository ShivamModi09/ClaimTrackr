import { useState } from "react";

export default function ClaimForm() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitClaim(e) {
    e.preventDefault();
    setLoading(true);
    setResult("");
    const fd = new FormData(e.target);

    try {
      const res = await fetch("http://localhost:8000/submit-claim", {
        method: "POST",
        body: fd,
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || `Status ${res.status}`);
      setResult(text);
    } catch (err) {
      setResult("Error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  function demoFill() {
    const f = document.forms[0];
    if (!f) return;
    f.name.value = "Surbhit Joshi";
    f.address.value = "Delhi";
    f.claim_type.value = "Health Insurance";
    f.claim_reason.value = "Bodyache and cough";
    f.date.value = new Date().toISOString().slice(0,10);
    f.medical_facility.value = "Apollo Hospitals";
    f.total_claim_amount.value = "1100";
    f.description.value = "None";
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <form onSubmit={submitClaim} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="col-span-1">
          <span className="text-sm font-medium">👤 Name</span>
          <input name="name" required className="w-full mt-1 p-3 border rounded bg-slate-50"/>
        </label>

        <label>
          <span className="text-sm font-medium">🏠 Address</span>
          <input name="address" className="w-full mt-1 p-3 border rounded bg-slate-50"/>
        </label>

        <label>
          <span className="text-sm font-medium">📄 Claim Type</span>
          <input name="claim_type" className="w-full mt-1 p-3 border rounded bg-slate-50"/>
        </label>

        <label>
          <span className="text-sm font-medium">💊 Claim Reason</span>
          <input name="claim_reason" className="w-full mt-1 p-3 border rounded bg-slate-50"/>
        </label>

        <label>
          <span className="text-sm font-medium">📅 Date of Service</span>
          <input name="date" type="date" className="w-full mt-1 p-3 border rounded bg-white"/>
        </label>

        <label>
          <span className="text-sm font-medium">🏥 Medical Facility</span>
          <input name="medical_facility" className="w-full mt-1 p-3 border rounded bg-slate-50"/>
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-medium">💰 Total Claim Amount (₹)</span>
          <input name="total_claim_amount" type="number" className="w-full mt-1 p-3 border rounded bg-slate-50"/>
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-medium">📝 Description (optional)</span>
          <textarea name="description" className="w-full mt-1 p-3 border rounded bg-white" rows="4"/>
        </label>

        <label className="md:col-span-2 block">
          <span className="text-sm font-medium">📎 Medical Bill (PDF) </span>
          <input type="file" name="medical_bill" accept="application/pdf" className="mt-2"/>
        </label>

        <div className="md:col-span-2 flex justify-between items-center">
          <button type="button" onClick={demoFill} className="px-4 py-2 rounded bg-white border">Fill demo</button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-indigo-600 text-white rounded">
            {loading ? "Processing..." : "🚀 Submit"}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">📊 AI Report</h3>
        <div className="mt-3 bg-slate-50 p-4 rounded min-h-[80px]">
          <pre className="whitespace-pre-wrap text-sm text-slate-700">{result || "No report yet."}</pre>
        </div>
      </div>
    </div>
  );
}
