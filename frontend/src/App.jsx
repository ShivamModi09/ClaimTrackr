import React from "react";
import ClaimForm from "./ClaimForm";
import "./styles.css"

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          {/* placeholder logo (won't break) */}
          <div className="w-10 h-10 rounded-md bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
            CT
          </div>
          <span className="text-lg font-semibold">ClaimTrackr</span>
        </div>
        <a href="#run" className="text-sm text-indigo-600 hover:underline">Try it now →</a>
      </nav>

      <header className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">ClaimTrackr — AI Automated Claim Processing</h1>
          <p className="text-lg text-slate-600 mb-6">
            Upload a bill — get an instant AI verdict and a detailed approval/rejection report.
          </p>
          <a href="#run" className="inline-block bg-indigo-600 text-white px-5 py-3 rounded-md shadow">Run a Check →</a>
        </div>

        <div className="w-full md:w-96 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 flex items-center justify-center shadow-lg">
              <img
                src="/main_image.webp"
                alt="ClaimTrakr image"
                className="rounded-md"
              />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-12 pb-24">
        <section>
          <h2 className="text-2xl font-bold mb-6">Why it's better 🚀</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">⚡ Faster decisions</h3>
              <p className="text-sm text-slate-600 mt-2">Automated checks in seconds — reduces manual processing time and backlog.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">🔍 Consistent rules</h3>
              <p className="text-sm text-slate-600 mt-2">Applies policy logic consistently — reduces human error & bias.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg">💾 Audit trail</h3>
              <p className="text-sm text-slate-600 mt-2">Save reports and evidence for compliance and review.</p>
            </div>
          </div>
        </section>

        <hr className="border-slate-200 w-1/4 mx-auto md:mx-0" />

        <section className="mb-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">What this project does</h2>
              <ul className="space-y-4 text-slate-700">
                {[
                  { id: "01", title: "Automated Data Extraction", desc: "Extracts structured information from uploaded medical PDFs using a high-fidelity parsing engine." },
                  { id: "02", title: "Contextual Policy Audit", desc: "Leverages RAG to compare claims against specific handbook rules and exclusion lists." },
                  { id: "03", title: "Intelligent Reporting", desc: "Generates human-readable approval/rejection reports with clear reasoning and suggested settlement amounts." }
                ].map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className="text-violet-500 font-bold">{item.id}.</span>
                    <span><strong>{item.title}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white rounded-xl shadow-2xl p-2 border border-slate-100 overflow-hidden">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2 pt-2">Efficiency Analysis: Manual vs AI</p>
                <img src="/process-comparison.png" alt="Process Comparison" className="rounded-lg w-full h-auto block" />
              </div>
            </div>
          </div>
        </section>
        
        <hr className="border-slate-200 w-1/4 mx-auto md:mx-0" />
        
        <section className="mb-20">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 order-last md:order-first relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-400 to-violet-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-white rounded-xl shadow-2xl p-2 border border-slate-100 overflow-hidden">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2 pt-2">System Architecture (RAG Flow)</p>
                <img src="/architecture.png" alt="Architecture" className="rounded-lg w-full h-auto block" />
              </div>
            </div>
        
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">How it works</h2>
              <div className="space-y-4">
                {[
                  { s: 1, t: "Data Collection & Ingestion", d: "Collects policy documents and medical bill data, performing initial validation and cleaning." },
                  { s: 2, t: "Embeddings & Vector Storage", d: "Converts policy text into high-dimensional vectors for semantic matching against claims." },
                  { s: 3, t: "Contextual Query & Analysis", d: "An LLM utilizes retrieved context from the vector database to generate a comprehensive assessment." },
                  { s: 4, t: "Structured Output Generation", d: "Parses the internal analysis into a structured final report for full transparency." }
                ].map((item) => (
                  <div key={item.s} className="p-4 rounded-lg bg-slate-50 border-l-4 border-violet-400 shadow-sm">
                    <p className="text-sm font-bold text-violet-600 uppercase mb-1">Step {item.s} — {item.t}</p>
                    <p className="text-slate-700 text-sm">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="run">
          <h2 className="text-2xl font-bold mb-3">Run a Claim Check 🧪</h2>
          <p className="text-slate-600 mb-6">Fill the form below and upload a medical bill (PDF). The AI will return a verdict and report.</p>

          <ClaimForm />
        </section>

        <section className="pt-16 pb-20 border-t border-slate-100">
          <div className="text-center mb-12 px-6">
            <h2 className="text-3xl font-bold mb-3">Product Report</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              Final report includes verdict (Approved / Rejected), reasons (amount mismatch, exclusions, name mismatch) and parsed bill summary.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 space-y-12">
            
            <div className="relative group">
              <div className="absolute top-6 right-6 z-10 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                Passed Case
              </div>
              <div className="bg-white p-2 md:p-4 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-emerald-400">
                <img 
                  src="/report-ss-passed.png" 
                  alt="Approved Claim Report" 
                  className="w-full h-auto block rounded-lg"
                />
              </div>
            </div>
        
            <div className="relative group">
              <div className="absolute top-6 right-6 z-10 bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 uppercase tracking-wider">
                Failed Case
              </div>
              <div className="bg-white p-2 md:p-4 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-rose-400">
                <img 
                  src="/report-ss-failed.png" 
                  alt="Rejected Claim Report" 
                  className="w-full h-auto block rounded-lg"
                />
              </div>
            </div>
        
          </div>
        </section>

      </main>

      <footer className="text-center py-6 text-slate-500">
        Built with React + FastAPI · Demo only
      </footer>
    </div>
  );
}
