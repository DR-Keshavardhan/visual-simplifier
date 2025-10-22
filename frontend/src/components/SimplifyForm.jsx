import React, {useState} from 'react'
import axios from 'axios'

export default function SimplifyForm({onResult}){
  const [text, setText] = useState('')
  const [level, setLevel] = useState('beginner')
  const [loading, setLoading] = useState(false)

  const doSimplify = async () =>{
    if(!text.trim()) return alert('Paste a paragraph first')
    setLoading(true)
    try{
      const resp = await axios.post('http://localhost:8000/api/simplify', { text, level })
      onResult(resp.data, resp.data.id)
    }catch(e){
      const msg = e.response?.data?.detail || e.message
      alert('Error: ' + msg)
    }finally{ setLoading(false) }
  }

  const doVisualize = async ()=>{
    if(!text.trim()) return alert('Paste a paragraph first')
    setLoading(true)
    try{
      const r = await axios.post('http://localhost:8000/api/visualize', { text, level })
      const s = await axios.post('http://localhost:8000/api/simplify', { text, level })
      const merged = {...s.data, image_url: r.data.image_url}
      onResult(merged, s.data.id)
    }catch(e){
      alert('Error: ' + (e.response?.data?.detail || e.message))
    }finally{ setLoading(false) }
  }

  const loadSample = (n) => {
    const samples = {
      1: "The centripetal force required to keep an object in circular motion is provided by the net force towards the center of the circle.",
      2: "Newton's second law states that the rate of change of momentum is proportional to the net force applied to a body; for constant mass this becomes F = ma.",
      3: "In a closed system, energy cannot be created or destroyed, only transformed from one form to another; potential energy may convert to kinetic energy as an object falls."
    }
    setText(samples[n])
  }

  return (
    <div className="card">
      <label style={{fontWeight:600}}>Paste physics paragraph</label>
      <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Paste dense textbook paragraph here..."></textarea>

      <div className="small-row" style={{marginTop:10}}>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <select value={level} onChange={e=>setLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <div style={{fontSize:13, color:'#64748b'}}>Samples:</div>
          <button onClick={()=>loadSample(1)} className="button-ghost">Centripetal</button>
          <button onClick={()=>loadSample(2)} className="button-ghost">Newton</button>
          <button onClick={()=>loadSample(3)} className="button-ghost">Energy</button>
        </div>

        <div style={{display:'flex', gap:8}}>
          <button onClick={doSimplify} className="button-primary" disabled={loading}>{loading ? 'Working...' : 'Simplify'}</button>
          <button onClick={doVisualize} className="button-ghost" disabled={loading}>Simplify + Visualize</button>
        </div>
      </div>
    </div>
  )
}
