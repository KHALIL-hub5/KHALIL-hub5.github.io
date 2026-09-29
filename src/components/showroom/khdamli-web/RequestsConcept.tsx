const requests = [
  { initials: 'MS', name: 'Mohammed Seghir Alaa', time: '8:00 - 12:00', price: 'Price : 500DA' },
  { initials: 'AN', name: 'Abdlouahab Nafsi', time: '8:00 - 17:00', price: 'Price : 3000DA' },
]

export function RequestsConcept() {
  return (
    <div className="kh-concept-page kh-concept-requests">
      <nav className="kh-concept-sidebar">
        <img src="/projects/khdamli/logo.webp" alt="" width="436" height="228" />
        <span>Home</span><span className="selected">Requests</span><span>Profile</span><span>Settings</span>
      </nav>
      <div className="kh-concept-request-content">
        <header className="kh-concept-request-header">
          <h3>List Of Requests</h3>
          <div><b>Pending</b><span>Sender</span><span>Completed</span></div>
        </header>
        {requests.map((request) => (
          <div className="kh-concept-request" key={request.initials}>
            <span className="kh-concept-avatar">{request.initials}</span>
            <div><strong>{request.name}</strong><span>" {request.time} "</span></div>
            <b className="kh-concept-price">{request.price}</b>
            <span className="kh-concept-accept">Accept ✓</span>
            <span className="kh-concept-reject">Reject ✕</span>
          </div>
        ))}
      </div>
    </div>
  )
}
