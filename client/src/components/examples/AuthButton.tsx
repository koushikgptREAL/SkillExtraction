import AuthButton from '../AuthButton'

export default function AuthButtonExample() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Sign In State:</p>
        <AuthButton />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Signed In State:</p>
        <AuthButton 
          user={{ 
            name: "John Doe", 
            email: "john.doe@example.com" 
          }} 
        />
      </div>
    </div>
  )
}