
const Warning = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#ef4444',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      padding: '12px',
      zIndex: 9999,
      fontSize: '16px'
    }}>
      Do not use your real email address instead use madeup one!
    </div>
  )
}

export default Warning