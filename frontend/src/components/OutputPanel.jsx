import React from 'react'

export default function OutputPanel({result}) {
  if(!result) return <div className="card">No result yet. Paste text and click Simplify.</div>

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div className="output-title">Simplified Explanation</div>
          <div style={{fontSize:12, color:'#64748b'}}>Level: {result.level || 'beginner'}</div>
        </div>
      </div>

      <div className="output-text">{result.simplified_text}</div>

      {result.analogy && (
        <div className="analogy"><strong>Analogy:</strong> {result.analogy}</div>
      )}

      {result.image_url && (
        <div className="diagram">
          <img src={`http://localhost:8000${result.image_url}`} alt="diagram" />
          <div style={{marginTop:8, fontSize:12, color:'#475569'}}>Generated diagram — downloadable from backend/static/images</div>
        </div>
      )}

      {result.questions && result.questions.length>0 && (
        <div style={{marginTop:12}}>
          <h4>Quick Quiz</h4>
          {result.questions.map((q,i)=>(<div key={i} style={{padding:10, border:'1px solid #eef4fb', borderRadius:8, marginTop:8}}>{q}</div>))}
        </div>
      )}
    </div>
  )
}
