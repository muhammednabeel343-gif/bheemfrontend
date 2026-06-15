
import type { CompatibilityReport } from '../types/game'

interface Props {
  report: CompatibilityReport
}

function formatPass(pass: boolean) {
  return pass ? 'Pass' : 'Fail'
}

function statusClasses(status: string) {
  switch (status) {
    case 'Excellent':
      return 'bg-emerald-100 text-emerald-700'
    case 'Playable':
      return 'bg-amber-100 text-amber-700'
    case 'Limited':
      return 'bg-orange-100 text-orange-700'
    case 'Not Recommended':
      return 'bg-rose-100 text-rose-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

function progressColor(score: number) {
  if (score >= 90) return 'bg-emerald-500'
  if (score >= 70) return 'bg-amber-500'
  if (score >= 50) return 'bg-orange-500'
  return 'bg-rose-500'
}

function CompatibilityReport({ report }: Props) {
  // Debug: log what we're receiving
  console.log('Compatibility Report:', report)
  console.log('AI Insights:', report.ai_insights)
  
  return (
<div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
     
     {/* AI INSIGHTS SECTION */}
     {report.ai_insights && (
       <div className="mb-6 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 p-6">
         <div className="mb-4 flex items-center gap-2">
           <span className="text-xl">✨</span>
           <h3 className="text-lg font-bold text-violet-900">AI Insights</h3>
         </div>

         <div className="space-y-4">
           {/* GPU Analysis */}
           {report.ai_insights.gpu_analysis && (
             <div className="rounded-2xl bg-white/60 p-3 text-sm">
               <p className="font-semibold text-violet-900">GPU Analysis</p>
               <p className="mt-1 text-slate-700">{report.ai_insights.gpu_analysis}</p>
             </div>
           )}

           {/* CPU Analysis */}
           {report.ai_insights.cpu_analysis && (
             <div className="rounded-2xl bg-white/60 p-3 text-sm">
               <p className="font-semibold text-violet-900">CPU Analysis</p>
               <p className="mt-1 text-slate-700">{report.ai_insights.cpu_analysis}</p>
             </div>
           )}

           {/* RAM Analysis */}
           {report.ai_insights.ram_analysis && (
             <div className="rounded-2xl bg-white/60 p-3 text-sm">
               <p className="font-semibold text-violet-900">RAM Analysis</p>
               <p className="mt-1 text-slate-700">{report.ai_insights.ram_analysis}</p>
             </div>
           )}

           {/* Expected Experience */}
           {report.ai_insights.expected_experience && (
             <div className="rounded-2xl bg-emerald-50 p-4 text-sm">
               <p className="font-semibold text-emerald-900">Expected Experience</p>
               <p className="mt-1 text-lg font-bold text-emerald-700">{report.ai_insights.expected_experience}</p>
             </div>
           )}

           {/* Recommended Settings */}
           {report.ai_insights.recommended_settings && report.ai_insights.recommended_settings.length > 0 && (
             <div className="rounded-2xl bg-white/60 p-3 text-sm">
               <p className="font-semibold text-violet-900">Recommended Settings</p>
               <ul className="mt-2 space-y-1">
                 {report.ai_insights.recommended_settings.map((setting, idx) => (
                   <li key={idx} className="flex items-start gap-2 text-slate-700">
                     <span className="text-emerald-600">▸</span>
                     {setting}
                   </li>
                 ))}
               </ul>
             </div>
           )}

           {/* Tips */}
           {report.ai_insights.tips && report.ai_insights.tips.length > 0 && (
             <div className="rounded-2xl bg-amber-50 p-3 text-sm">
               <p className="font-semibold text-amber-900">Tips & Tricks</p>
               <ul className="mt-2 space-y-1">
                 {report.ai_insights.tips.map((tip, idx) => (
                   <li key={idx} className="flex items-start gap-2 text-slate-700">
                     <span className="text-amber-600">💡</span>
                     {tip}
                   </li>
                 ))}
               </ul>
             </div>
           )}

           {/* Warnings */}
           {report.ai_insights.warnings && report.ai_insights.warnings.length > 0 && (
             <div className="rounded-2xl bg-rose-50 p-3 text-sm">
               <p className="font-semibold text-rose-900">⚠️ Warnings</p>
               <ul className="mt-2 space-y-1">
                 {report.ai_insights.warnings.map((warning, idx) => (
                   <li key={idx} className="flex items-start gap-2 text-slate-700">
                     <span className="text-rose-600">⚠</span>
                     {warning}
                   </li>
                 ))}
               </ul>
             </div>
           )}
         </div>
       </div>
     )}






     
<div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] items-start">

  {/* LEFT COLUMN */}
  <div className="space-y-6">

    {/* Minimum Requirements */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Minimum Requirements
      </h4>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
        <div>
          <p className="font-semibold">CPU</p>
          <p className="break-words leading-relaxed">
            {report.minimum_requirements.cpu}
          </p>
        </div>

        <div>
          <p className="font-semibold">GPU</p>
          <p className="break-words leading-relaxed">
            {report.minimum_requirements.gpu}
          </p>
        </div>

        <div>
          <p className="font-semibold">RAM</p>
          <p>{report.minimum_requirements.ram_gb} GB</p>
        </div>

        <div>
          <p className="font-semibold">Storage</p>
          <p>{report.minimum_requirements.storage_gb} GB</p>
        </div>

        <div className="sm:col-span-2">
          <p className="font-semibold">Operating System</p>
          <p className="break-words leading-relaxed">
            {report.minimum_requirements.operating_system}
          </p>
        </div>
      </div>
    </div>

    {/* Your System */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Your System
      </h4>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
        <div>
          <p className="font-semibold">CPU</p>
          <p className="break-words leading-relaxed">
            {report.user_specs.cpu}
          </p>
        </div>

        <div>
          <p className="font-semibold">GPU</p>
          <p className="break-words leading-relaxed">
            {report.user_specs.gpu}
          </p>
        </div>

        <div>
          <p className="font-semibold">RAM</p>
          <p>{report.user_specs.ram_gb} GB</p>
        </div>

        <div>
          <p className="font-semibold">Storage</p>
          <p>{report.user_specs.storage_gb} GB</p>
        </div>

        <div className="sm:col-span-2">
          <p className="font-semibold">Operating System</p>
          <p className="break-words leading-relaxed">
            {report.user_specs.operating_system}
          </p>
        </div>
      </div>
    </div>

    {/* Compatibility Score */}
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Compatibility Score
          </p>

          <p className="text-4xl font-bold text-slate-900">
            {report.compatibility_percentage}%
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClasses(
            report.status
          )}`}
        >
          {report.status}
        </span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${progressColor(
            report.compatibility_percentage
          )}`}
          style={{
            width: `${report.compatibility_percentage}%`,
          }}
        />
      </div>
    </div>

  </div>

  {/* RIGHT COLUMN */}
  <div className="space-y-6">

    {/* Compatibility Analysis */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Compatibility Analysis
      </p>

      <div className="mt-4 space-y-3">
        {[
          { label: 'CPU', pass: report.checks.cpu_pass },
          { label: 'GPU', pass: report.checks.gpu_pass },
          { label: 'RAM', pass: report.checks.ram_pass },
          { label: 'Storage', pass: report.checks.storage_pass },
          { label: 'Operating System', pass: report.checks.os_pass },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3"
          >
            <span className="flex items-center gap-2">
              <span className={item.pass ? 'text-emerald-600' : 'text-rose-600'}>
                {item.pass ? '✓' : '✕'}
              </span>
              {item.label}
            </span>

            <span className={item.pass ? 'text-emerald-600' : 'text-rose-600'}>
              {formatPass(item.pass)}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* Estimated FPS */}
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        Estimated FPS
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {[
          { label: '1080p Low', value: report.estimated_fps.low },
          { label: '1080p Medium', value: report.estimated_fps.medium },
          { label: '1080p High', value: report.estimated_fps.high },
          { label: '1080p Ultra', value: report.estimated_fps.ultra },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-slate-100 p-4 text-center"
          >
            <p className="font-semibold text-slate-700">
              {item.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>

</div>
</div>

           )
}

export default CompatibilityReport
