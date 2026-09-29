const workers = [
  { initials: 'MS', name: 'Mohammed Seghir Alaa', time: '8:00 - 12:00', price: 'Price : 500DA' },
  { initials: 'AN', name: 'Abdlouahab Nafsi', time: '8:00 - 17:00', price: 'Price : 3000DA' },
]

export function FindWorkerConcept() {
  return (
    <div className="kh-concept-page kh-concept-workers">
      <header className="kh-concept-header">
        <h3>Find a worker</h3>
        <div className="kh-concept-input">Search plumbing, repairs…</div>
      </header>
      <div className="kh-concept-worker-layout">
        <div className="kh-concept-worker-results">
          <div className="kh-concept-chips">
            <span className="selected">Plumbing</span><span>Repairs</span><span>Construction</span>
          </div>
          {workers.map((worker) => (
            <div className="kh-concept-worker" key={worker.initials}>
              <span className="kh-concept-avatar">{worker.initials}</span>
              <div><strong>{worker.name}</strong><span>{worker.time}</span></div>
              <b className="kh-concept-price">{worker.price}</b>
            </div>
          ))}
        </div>
        <aside className="kh-concept-filters">
          <h4>Working days</h4>
          <div className="kh-concept-days">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu'].map((day) => <span key={day}>{day}</span>)}</div>
          <h4>Payment method</h4>
          {['Cash', 'Baridimob', 'CCP'].map((method) => <div className="kh-concept-payment" key={method}>◯ {method}</div>)}
        </aside>
      </div>
    </div>
  )
}
