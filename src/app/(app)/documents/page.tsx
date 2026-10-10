import { FileText, LockKeyhole } from 'lucide-react'

export default function DocumentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-8">
        <div className="flex items-start gap-4">
          <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">Document Intelligence</h1>
            <p className="text-slate-300 leading-relaxed">
              Document ingestion is intentionally unavailable in the public beta until storage, malware scanning, parsing, access controls, deletion, and citation-preserving indexing have all passed production review.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-10 text-center">
        <LockKeyhole className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Uploads are disabled</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          EMET will not pretend a file was uploaded, encrypted, processed, or indexed. This control will be enabled only when the backend can prove those states and preserve source provenance end to end.
        </p>
      </div>
    </div>
  )
}
