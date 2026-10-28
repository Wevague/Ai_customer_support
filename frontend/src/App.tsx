
import { useState } from 'react'
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Settings,
  Search,
  Plus,
  Bot,
  UserRound,
  Send,
  CheckCheck,
  Clock3,
  CircleCheck,
  ChevronDown,
  Headphones,
} from 'lucide-react'
import './App.css'

type Message = {
  id: number
  sender: 'customer' | 'ai' | 'human'
  text: string
  time: string
}

type Conversation = {
  id: number
  name: string
  email: string
  preview: string
  time: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  messages: Message[]
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: 'Rahul Menon',
    email: 'rahul@example.com',
    preview: 'How long does delivery take?',
    time: '10:42 AM',
    status: 'OPEN',
    messages: [
      {
        id: 1,
        sender: 'customer',
        text: 'Hi! I want to know about your delivery policy.',
        time: '10:40 AM',
      },
      {
        id: 2,
        sender: 'ai',
        text: 'Hello! I can help with that. What would you like to know about delivery?',
        time: '10:41 AM',
      },
      {
        id: 3,
        sender: 'customer',
        text: 'How long does delivery take?',
        time: '10:42 AM',
      },
    ],
  },
  {
    id: 2,
    name: 'Anjali Nair',
    email: 'anjali@example.com',
    preview: 'Is this product available?',
    time: '10:18 AM',
    status: 'IN_PROGRESS',
    messages: [
      {
        id: 4,
        sender: 'customer',
        text: 'Is the oil dispenser available?',
        time: '10:18 AM',
      },
      {
        id: 5,
        sender: 'ai',
        text: 'I can help you with product availability.',
        time: '10:19 AM',
      },
    ],
  },
  {
    id: 3,
    name: 'Arjun Das',
    email: 'arjun@example.com',
    preview: 'Thank you for your help!',
    time: 'Yesterday',
    status: 'RESOLVED',
    messages: [
      {
        id: 6,
        sender: 'customer',
        text: 'Thank you for your help!',
        time: 'Yesterday',
      },
    ],
  },
]

function App() {
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedId, setSelectedId] = useState(1)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('ALL')

  const selected = conversations.find((item) => item.id === selectedId)

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch =
      conversation.name.toLowerCase().includes(search.toLowerCase()) ||
      conversation.preview.toLowerCase().includes(search.toLowerCase())

    const matchesFilter =
      filter === 'ALL' || conversation.status === filter

    return matchesSearch && matchesFilter
  })

  function sendMessage() {
    if (!draft.trim() || !selected) return

    const newMessage: Message = {
      id: Date.now(),
      sender: 'human',
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selected.id
          ? {
              ...conversation,
              preview: newMessage.text,
              time: newMessage.time,
              messages: [...conversation.messages, newMessage],
            }
          : conversation,
      ),
    )

    setDraft('')
  }

  function changeStatus(status: Conversation['status']) {
    if (!selected) return

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selected.id
          ? { ...conversation, status }
          : conversation,
      ),
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Headphones size={23} />
          </div>
          <div>
            <h1>SupportFlow</h1>
            <p>AI SUPPORT PLATFORM</p>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          <button className="nav-item">
            <LayoutDashboard size={19} />
            Dashboard
          </button>
          <button className="nav-item active">
            <MessageSquare size={19} />
            Conversations
            <span className="nav-count">{conversations.length}</span>
          </button>
          <button className="nav-item">
            <BookOpen size={19} />
            Knowledge Base
          </button>
          <button className="nav-item">
            <Settings size={19} />
            Settings
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="plan-card">
            <div className="plan-icon">
              <Bot size={19} />
            </div>
            <strong>AI Assistant</strong>
            <p>Your support assistant is ready to help.</p>
            <span className="online-indicator">
              <span /> Demo mode
            </span>
          </div>

          <div className="profile">
            <div className="avatar profile-avatar">SF</div>
            <div className="profile-info">
              <strong>Smart Finds</strong>
              <span>Store administrator</span>
            </div>
            <ChevronDown size={17} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Support</p>
            <h2>Conversations</h2>
          </div>
          <button className="primary-button" onClick={() => {
            setSearch('')
            setFilter('ALL')
          }}>
            <Plus size={18} />
            All conversations
          </button>
        </header>

        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <MessageSquare size={20} />
            </div>
            <div>
              <p>Total conversations</p>
              <strong>{conversations.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon amber">
              <Clock3 size={20} />
            </div>
            <div>
              <p>In progress</p>
              <strong>
                {conversations.filter((c) => c.status === 'IN_PROGRESS').length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCheck size={20} />
            </div>
            <div>
              <p>Resolved</p>
              <strong>
                {conversations.filter((c) => c.status === 'RESOLVED').length}
              </strong>
            </div>
          </div>
        </section>

        <section className="inbox">
          <aside className="conversation-panel">
            <div className="panel-heading">
              <div>
                <h3>Inbox</h3>
                <p>{filteredConversations.length} conversations</p>
              </div>
              <button
                className="icon-button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <Plus size={19} />
              </button>
            </div>

            <div className="search-box">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations..."
              />
            </div>

            <div className="filter-tabs">
              {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                <button
                  key={status}
                  className={filter === status ? 'filter-tab selected' : 'filter-tab'}
                  onClick={() => setFilter(status)}
                >
                  {status === 'ALL'
                    ? 'All'
                    : status === 'IN_PROGRESS'
                      ? 'Active'
                      : status === 'RESOLVED'
                        ? 'Resolved'
                        : 'Open'}
                </button>
              ))}
            </div>

            <div className="conversation-list">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className={
                    selectedId === conversation.id
                      ? 'conversation-item selected-conversation'
                      : 'conversation-item'
                  }
                  onClick={() => setSelectedId(conversation.id)}
                >
                  <div className="conversation-avatar">
                    {conversation.name.split(' ').map((part) => part[0]).join('')}
                  </div>

                  <div className="conversation-content">
                    <div className="conversation-topline">
                      <strong>{conversation.name}</strong>
                      <span>{conversation.time}</span>
                    </div>
                    <p>{conversation.preview}</p>
                    <span className={`status-badge ${conversation.status.toLowerCase()}`}>
                      {conversation.status.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))}

              {filteredConversations.length === 0 && (
                <p className="empty-state">No conversations found.</p>
              )}
            </div>
          </aside>

          <section className="chat-panel">
            {selected ? (
              <>
                <div className="chat-header">
                  <div className="chat-person">
                    <div className="conversation-avatar large">
                      {selected.name.split(' ').map((part) => part[0]).join('')}
                    </div>
                    <div>
                      <h3>{selected.name}</h3>
                      <p>{selected.email}</p>
                    </div>
                  </div>

                  <div className="chat-actions">
                    <span className={`status-badge ${selected.status.toLowerCase()}`}>
                      {selected.status.replace('_', ' ')}
                    </span>
                    <select
                      aria-label="Conversation status"
                      value={selected.status}
                      onChange={(event) =>
                        changeStatus(event.target.value as Conversation['status'])
                      }
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>
                  </div>
                </div>

                <div className="chat-context">
                  <div className="context-icon">
                    <Bot size={18} />
                  </div>
                  <p>
                    <strong>AI-assisted conversation</strong>
                    <span> Messages shown here are sample data for now.</span>
                  </p>
                </div>

                <div className="message-list">
                  <div className="day-divider">
                    <span>Conversation history</span>
                  </div>

                  {selected.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-row ${message.sender === 'customer' ? 'incoming' : 'outgoing'}`}
                    >
                      {message.sender === 'customer' && (
                        <div className="message-avatar">
                          <UserRound size={17} />
                        </div>
                      )}

                      <div className="message-body">
                        <div className="message-meta">
                          <strong>
                            {message.sender === 'customer'
                              ? selected.name
                              : message.sender === 'ai'
                                ? 'AI Assistant'
                                : 'You'}
                          </strong>
                          <span>{message.time}</span>
                        </div>
                        <div className={`message-bubble ${message.sender}`}>
                          {message.sender === 'ai' && (
                            <Bot size={16} className="bubble-bot" />
                          )}
                          {message.text}
                        </div>
                      </div>

                      {message.sender !== 'customer' && (
                        <div className="message-avatar assistant-avatar">
                          {message.sender === 'ai' ? (
                            <Bot size={17} />
                          ) : (
                            <UserRound size={17} />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form
                  className="reply-box"
                  onSubmit={(event) => {
                    event.preventDefault()
                    sendMessage()
                  }}
                >
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a reply to the customer..."
                    rows={2}
                  />
                  <div className="reply-footer">
                    <span>
                      <Bot size={16} />
                      Human agent reply
                    </span>
                    <button
                      className="send-button"
                      type="submit"
                      disabled={!draft.trim()}
                    >
                      Send reply
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="empty-chat">
                <CircleCheck size={38} />
                <h3>Select a conversation</h3>
                <p>Choose a conversation from your inbox to view its messages.</p>
              </div>
            )}
          </section>
        </section>

        <footer className="page-footer">
          <span>SupportFlow · AI Customer Support</span>
          <span>Frontend preview · Sample data only</span>
        </footer>
      </main>
    </div>
  )
}

export default App
