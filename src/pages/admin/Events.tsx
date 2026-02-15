import { useState } from 'react'

export interface Event {
  id: string
  title: string
  description: string
  category: string
  endDate: string
  status: 'active' | 'settled' | 'cancelled'
  outcomes: { name: string; probability: number }[]
}

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Will Bitcoin reach $100k by end of 2025?',
    description: 'Will Bitcoin reach above $100,000 by end of year?',
    category: 'Crypto',
    endDate: '2025-12-31',
    status: 'active',
    outcomes: [
      { name: 'Yes', probability: 65 },
      { name: 'No', probability: 35 },
    ],
  },
  {
    id: '2',
    title: 'Will AI pass Turing test by June 2025?',
    description: 'Will an AI pass a rigorous Turing Test by end of 2026?',
    category: 'AI',
    endDate: '2025-06-30',
    status: 'active',
    outcomes: [
      { name: 'Yes', probability: 45 },
      { name: 'No', probability: 55 },
    ],
  },
  {
    id: '3',
    title: 'Super Bowl 2026 Winner',
    description: 'Who will win Super Bowl 2026?',
    category: 'Sports',
    endDate: '2026-02-08',
    status: 'active',
    outcomes: [
      { name: 'Chiefs', probability: 30 },
      { name: '49ers', probability: 25 },
      { name: 'Bills', probability: 20 },
      { name: 'Other', probability: 25 },
    ],
  },
  {
    id: '4',
    title: 'Will US enter recession in 2025?',
    description: 'Will the US economy enter a recession in 2025?',
    category: 'Politics',
    endDate: '2025-12-31',
    status: 'settled',
    outcomes: [
      { name: 'Yes', probability: 40 },
      { name: 'No', probability: 60 },
    ],
  },
]

const categories = ['Crypto', 'AI', 'Politics', 'Sports', 'Business', 'Entertainment']

function EventModal({
  event,
  onClose,
  onSave,
}: {
  event?: Event | null
  onClose: () => void
  onSave: (event: Event) => void
}) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [category, setCategory] = useState(event?.category || 'Crypto')
  const [endDate, setEndDate] = useState(event?.endDate || '')
  const [status, setStatus] = useState(event?.status || 'active')
  const [outcome1Name, setOutcome1Name] = useState(event?.outcomes[0]?.name || 'Yes')
  const [outcome1Prob, setOutcome1Prob] = useState(event?.outcomes[0]?.probability || 50)
  const [outcome2Name, setOutcome2Name] = useState(event?.outcomes[1]?.name || 'No')
  const [outcome2Prob, setOutcome2Prob] = useState(event?.outcomes[1]?.probability || 50)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newEvent: Event = {
      id: event?.id || Date.now().toString(),
      title,
      description,
      category,
      endDate,
      status: status as Event['status'],
      outcomes: [
        { name: outcome1Name, probability: outcome1Prob },
        { name: outcome2Name, probability: outcome2Prob },
      ],
    }
    onSave(newEvent)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Event['status'])}>
              <option value="active">Active</option>
              <option value="settled">Settled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="form-section">
            <h3>Outcomes</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Outcome 1</label>
                <input
                  type="text"
                  value={outcome1Name}
                  onChange={(e) => setOutcome1Name(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Probability %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={outcome1Prob}
                  onChange={(e) => setOutcome1Prob(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Outcome 2</label>
                <input
                  type="text"
                  value={outcome2Name}
                  onChange={(e) => setOutcome2Name(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Probability %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={outcome2Prob}
                  onChange={(e) => setOutcome2Prob(Number(e.target.value))}
                  required
                />
              </div>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({
  eventTitle,
  onConfirm,
  onCancel,
}: {
  eventTitle: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Event</h2>
        <p>Are you sure you want to delete "{eventTitle}"? This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    setEditingEvent(null)
    setShowModal(true)
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowModal(true)
  }

  const handleSave = (event: Event) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)))
    } else {
      setEvents([...events, event])
    }
    setShowModal(false)
    setEditingEvent(null)
  }

  const handleDelete = (event: Event) => {
    setDeletingEvent(event)
  }

  const confirmDelete = () => {
    if (deletingEvent) {
      setEvents(events.filter((e) => e.id !== deletingEvent.id))
      setDeletingEvent(null)
    }
  }

  const getStatusClass = (status: Event['status']) => {
    switch (status) {
      case 'active': return 'status-active'
      case 'settled': return 'status-settled'
      case 'cancelled': return 'status-cancelled'
    }
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Event Management</h1>
          <p>Create, edit, and manage prediction market events.</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>+ New Event</button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="settled">Settled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>End Date</th>
              <th>Outcomes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">No events found.</td>
              </tr>
            ) : (
              filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div className="event-title">{event.title}</div>
                    <div className="event-desc">{event.description}</div>
                  </td>
                  <td><span className="chip">{event.category}</span></td>
                  <td>{event.endDate}</td>
                  <td className="outcomes-cell">
                    {event.outcomes.map((o) => (
                      <span key={o.name} className="outcome-badge">
                        {o.name}: {o.probability}%
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-icon" onClick={() => handleEdit(event)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(event)} title="Delete">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => {
            setShowModal(false)
            setEditingEvent(null)
          }}
          onSave={handleSave}
        />
      )}

      {deletingEvent && (
        <DeleteConfirmModal
          eventTitle={deletingEvent.title}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingEvent(null)}
        />
      )}
    </div>
  )
}
