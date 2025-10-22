import React, {useState} from 'react'
import SimplifyForm from './components/SimplifyForm'
import OutputPanel from './components/OutputPanel'
import ChatPanel from './components/ChatPanel'

export default function App(){
  const [result, setResult] = useState(null)
  const [interactionId, setInteractionId] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
        <h1 className="text-2xl font-semibold text-slate-800">Visual Concept Simplifier</h1>
        <div className="text-sm text-slate-600">Demo: Simplify text, generate analogies & diagrams</div>
      </header>
      <main className="max-w-6xl mx-auto grid grid-cols-12 gap-6 mt-6">
        <aside className="col-span-5">
          <SimplifyForm onResult={(res, id)=>{ setResult(res); setInteractionId(id) }} />
        </aside>
        <section className="col-span-7">
          <OutputPanel result={result} interactionId={interactionId} />
          <div className="mt-4">
            <ChatPanel interactionId={interactionId} />
          </div>
        </section>
      </main>
    </div>
  )
}
