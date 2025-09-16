import FileUpload from '../FileUpload'

export default function FileUploadExample() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Empty State:</p>
        <FileUpload />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Processing State:</p>
        <FileUpload 
          isProcessing={true}
          onFileUpload={(file) => console.log('File uploaded:', file.name)}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Complete State:</p>
        <FileUpload 
          isComplete={true}
          onFileUpload={(file) => console.log('File uploaded:', file.name)}
        />
      </div>
    </div>
  )
}