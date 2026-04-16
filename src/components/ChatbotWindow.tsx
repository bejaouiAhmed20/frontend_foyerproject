import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatbotWindowProps {
  onClose: () => void
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? ''

const SYSTEM_PROMPT = `Tu es un assistant virtuel intelligent et empathique pour une plateforme de gestion d'hébergement universitaire. Tu aides les étudiants à :
- Trouver une chambre adaptée à leurs besoins (Simple, Double, Triple)
- Comprendre le processus de réservation
- Naviguer dans les différents blocs et foyers
- Répondre à leurs questions sur la vie en résidence universitaire
- Les guider émotionnellement (stress de première année, inquiétudes, etc.)

Réponds toujours en français, de manière chaleureuse, concise et utile. Si un étudiant semble stressé, sois empathique avant d'être informatif. Tu fais partie du système de gestion du Foyer Universitaire.`

export default function ChatbotWindow({ onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Bonjour ! 👋 Je suis votre assistant du Foyer Universitaire. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const history = [...messages, userMessage].map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: history,
            generationConfig: { temperature: 0.8, maxOutputTokens: 512 },
          }),
        }
      )

      const data = await response.json()
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Désolé, je n'ai pas pu obtenir une réponse. Veuillez réessayer."

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: reply, timestamp: new Date() },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "⚠️ Une erreur s'est produite. Vérifiez votre connexion ou la clé API Gemini.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '24px',
        width: '380px',
        height: '520px',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)',
        zIndex: 9999,
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
        animation: 'chatSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-6px); }
        }
        .chat-msg-user { animation: msgIn 0.2s ease; }
        .chat-msg-bot  { animation: msgIn 0.2s ease; }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .chat-input:focus { outline: none; }
        .send-btn:hover { background: #1d4ed8 !important; }
        .send-btn:active { transform: scale(0.95); }
        .close-btn:hover { background: rgba(255,255,255,0.2) !important; }
      `}</style>

      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
          }}
        >
          🏠
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>
            Assistant Foyer
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
            En ligne · Propulsé par Gemini IA
          </div>
        </div>
        <button
          className="close-btn"
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: '#fff',
            width: 32,
            height: 32,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '82%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #2563eb, #3b82f6)'
                  : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1e293b',
                fontSize: 14,
                lineHeight: 1.55,
                boxShadow: msg.role === 'user'
                  ? '0 2px 8px rgba(37,99,235,0.25)'
                  : '0 2px 8px rgba(0,0,0,0.07)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {msg.content}
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, paddingInline: 4 }}>
              {formatTime(msg.timestamp)}
            </span>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div
              style={{
                background: '#fff',
                borderRadius: '18px 18px 18px 4px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                display: 'flex',
                gap: 5,
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#3b82f6',
                    display: 'inline-block',
                    animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          background: '#fff',
          borderTop: '1px solid #e2e8f0',
          padding: '12px 16px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Posez votre question..."
          disabled={loading}
          style={{
            flex: 1,
            border: '1.5px solid #e2e8f0',
            borderRadius: 12,
            padding: '10px 14px',
            fontSize: 14,
            background: '#f8fafc',
            color: '#1e293b',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
          onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
        />
        <button
          className="send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: 12,
            width: 42,
            height: 42,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !input.trim() ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s, transform 0.1s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
