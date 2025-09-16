import Dashboard from '../Dashboard'

export default function DashboardExample() {
  return (
    <Dashboard 
      user={{ 
        name: "Sarah Johnson", 
        email: "sarah.johnson@example.com" 
      }} 
    />
  )
}