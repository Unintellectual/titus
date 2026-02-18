import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import  GenerateTicket from './components/generate_ticket.jsx'
import  TicketStatus from './components/ticket_status.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TicketStatus />
    <GenerateTicket />
  </StrictMode>,
)
