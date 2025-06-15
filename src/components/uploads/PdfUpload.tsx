import { useState } from 'react';
import { uploadPDFToStorage, updateReportInSession } from '@/utils/uploadUtils';

export default function UploadPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file || !sessionId) {
      alert('Select file and enter session ID');
      return;
    }

    try {
      setLoading(true);
      const filePath = await uploadPDFToStorage(file, sessionId);
      await updateReportInSession(sessionId, filePath);
      setMessage('Upload and update successful!');
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload PDF to Session</h1>
      <input
        type="text"
        placeholder="Session ID"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <br /><br />
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload PDF'}
      </button>
      <p>{message}</p>
    </div>
  );
}
