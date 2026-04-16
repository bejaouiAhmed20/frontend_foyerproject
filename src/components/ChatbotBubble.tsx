import { useState } from 'react'
import ChatbotWindow from './ChatbotWindow'

export default function ChatbotBubble() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <style>{`
        @keyframes bubblePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(37,99,235,0); }
        }
        @keyframes bubblePop {
          0%   { transform: scale(0.8) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .chat-bubble-btn {
          animation: bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards,
                     bubblePulse 2.5s ease-in-out 1s infinite;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
        }
        .chat-bubble-btn:hover {
          transform: scale(1.1) !important;
          animation: none !important;
          box-shadow: 0 8px 32px rgba(37,99,235,0.45) !important;
        }
        .chat-bubble-btn:active {
          transform: scale(0.95) !important;
        }
        .notification-dot {
          animation: notifPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes notifPop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
      `}</style>

      {open && <ChatbotWindow onClose={() => setOpen(false)} />}

      <button
        className="chat-bubble-btn"
        onClick={() => setOpen((v) => !v)}
        title="Assistant Foyer Universitaire"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
        }}
      >
        {/* Icon switches between chat and close */}
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {/* Notification dot (only when closed) */}
        {!open && (
          <span
            className="notification-dot"
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#f43f5e',
              border: '2px solid white',
            }}
          />
        )}
      </button>
    </>
  )
}
