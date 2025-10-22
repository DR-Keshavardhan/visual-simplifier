import React, {useState} from 'react'
import axios from 'axios'

export default function ChatPanel({interactionId}){
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async ()=>{
    if(!text.trim()) return
    if(!interactionId) return alert('Please simplify a concept first to create context.')
    setLoading(true)
    try{
      const r = await axios.post('http://localhost:8000/api/chat', { interaction_id: interactionId, message: text })
      setMsgs(prev=>[...prev, {role:'user', text}, {role:'assistant', text: r.data.reply}])
      setText('')
    }catch(e){ alert('Chat error: ' + (e.response?.data?.detail || e.message)) }
    finally{ setLoading(false) }
  }

  return (
    <div className="card chat-box">
      <h4 style={{margin:0}}>Ask a follow-up</h4>
      <div className="chat-history" style={{marginTop:10}}>
        {msgs.length===0 && (<div style={{color:'#64748b'}}>No messages yet. Ask about the simplified explanation above.</div>)}
        {msgs.map((m,i)=>(<div key={i} style={{marginTop:8, textAlign: m.role==='user' ? 'right' : 'left'}}><div style={{display:'inline-block', padding:8, borderRadius:8, background: m.role==='user' ? '#dcf6ff' : '#f1f5f9'}}>{m.text}</div></div>))}
      </div>

      <div className="chat-input-row">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask a question about the simplified explanation..." />
        <button className="button-primary" onClick={send} disabled={loading}>{loading ? 'Thinking...' : 'Ask'}</button>
      </div>
    </div>
  )
}
