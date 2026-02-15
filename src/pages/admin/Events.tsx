import { useState } from 'react'

export interface Event {
  id: string
  title: string
  description: string
  category: string
  endDate: string
  status: 'active' | 'resolved' | 'cancelled'
  outcomes: { id: string; name: string; probability: number }[]
}

const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Bitcoin above $100k by EOY',
    description: 'Will Bitcoin reach above $100,000 by end of year?',
    category: 'Crypto',
    endDate: '2026-12-31',
    status: 'active',
    outcomes: [
      { id: '1a', name: 'Yes', probability: 65 },
      { id: '1b', name: 'No', probability: 35 },
    ],
  },
  {
    id: '2',
    title: 'AI passes Turing Test by 2026',
    description: 'Will an AI pass a rigorous Turing Test by end of 2026?',
    category: 'AI',
    endDate: '2026-12-31',
    status: 'active',
    outcomes: [
      { id: '2a', name: 'Yes', probability: 45 },
      { id: '2b', name: 'No', probability: 55 },
    ],
  },
  {
    id: '3',
    title: 'US Election 2024 Winner',
    description: 'Who will win the 2024 US Presidential Election?',
    category: 'Politics',
    endDate: '2024-11-05',
    status: 'resolved',
    outcomes: [
      { id: '3a', name: 'Democrat', probability: 52 },
      { id: '3b', name: 'Republican', probability: 48 },
    ],
  },
]

let nextId = 4

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [showModal, setShowModal] = useState<'create' | 'edit' | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Crypto',
    endDate: '',
    status: 'active' as Event['status'],
    outcomes: [{ name: '', probability: 50 }, { name: '', probability: 50 }],
  })

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const openCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Crypto',
      endDate: '',
      status: 'active',
      outcomes: [{ name: '', probability: 50 }, { name: '', probability: 50 }],
    })
    setErrors({})
    setShowModal('create')
  }

  const openEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      endDate: event.endDate,
      status: event.status,
      outcomes: event.outcomes.map((o) => ({ name: o.name, probability: o.probability })),
    })
    setErrors({})
    setShowModal('edit')
  }

  const closeModal = () => {
    setShowModal(null)
    setEditingEvent(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.endDate) newErrors.endDate = 'End date is required'
    const validOutcomes = formData.outcomes.filter((o) => o.name.trim())
    if (validOutcomes.length < 2) newErrors.outcomes = 'At least 2 outcomes are required'
    const totalProb = validOutcomes.reduce((sum, o) => sum + o.probability, 0)
    if (totalProb !== 100) newErrors.probability = 'Probabilities must sum to 100'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const validOutcomes = formData.outcomes
      .filter((o) => o.name.trim())
      .map((o, i) => ({ id: `${Date.now()}-${i}`, name: o.name.trim(), probability: o.probability }))

    if (showModal === 'create') {
      const newEvent: Event = {
        id: String(nextId++),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        endDate: formData.endDate,
        status: formData.status,
        outcomes: validOutcomes,
      }
      setEvents([newEvent, ...events])
    } else if (showModal === 'edit' && editingEvent) {
      setEvents(
        events.map((ev) =>
          ev.id === editingEvent.id
            ? { ...ev, title: formData.title.trim(), description: formData.description.trim(), category: formData.category, endDate: formData.endDate, status: formData.status, outcomes: validOutcomes }
            : ev
        )
      )
    }
    closeModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter((ev) => ev.id !== id))
    }
  }

  const updateOutcome = (index: number, field: 'name' | 'probability', value: string | number) => {
    const newOutcomes = [...formData.outcomes]
    newOutcomes[index] = { ...newOutcomes[index], [field]: value }
    setFormData({ ...formData, outcomes: newOutcomes })
  }

  const addOutcome = () => {
    setFormData({
      ...formData,
      outcomes: [...formData.outcomes, { name: '', probability: 0 }],
    })
  }

  const removeOutcome = (index: number) => {
    if (formData.outcomes.length <= 2) return
    const newOutcomes = formData.outcomes.filter((_, i) => i !== index)
    setFormData({ ...formData, outcomes: newOutcomes })
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Event Management</h1>
          <p>Create, edit, and manage prediction market events.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Event</button>
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
          <option value="resolved">Resolved</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">No events found.</td>
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
                  <td>
                    <span className={`status-badge status-${event.status}`}>{event.status}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => openEdit(event)} title="Edit">✎</button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(event.id)} title="Delete">✕</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{showModal === 'create' ? 'Create Event' : 'Edit Event'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? 'input-error' : ''}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={errors.description ? 'input-error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="Crypto">Crypto</option>
                    <option value="AI">AI</option>
                    <option value="Politics">Politics</option>
                    <option value="Sports">Sports</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={errors.endDate ? 'input-error' : ''}
                  />
                  {errors.endDate && <span className="error-text">{errors.endDate}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}>
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Outcomes</label>
                {errors.outcomes && <span className="error-text">{errors.outcomes}</span>}
                {errors.probability && <span className="error-text">{errors.probability}</span>}
                {formData.outcomes.map((outcome, index) => (
                  <div key={index} className="outcome-row">
                    <input
                      type="text"
                      placeholder="Outcome name"
                      value={outcome.name}
                      onChange={(e) => updateOutcome(index, 'name', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={outcome.probability}
                      onChange={(e) => updateOutcome(index, 'probability', parseInt(e.target.value) || 0)}
                    />
                    <span className="prob-label">%</span>
                    {formData.outcomes.length > 2 && (
                      <button type="button" className="btn-icon btn-danger" onClick={() => removeOutcome(index)}>✕</button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-secondary btn-small" onClick={addOutcome}>+ Add Outcome</button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">{showModal === 'create' ? 'Create' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
