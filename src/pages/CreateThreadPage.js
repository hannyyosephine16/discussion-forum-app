import { Link } from 'react-router-dom';
import ThreadForm from '../components/threads/ThreadForm';

function CreateThreadPage() {
  return (
    <div className="create-thread-page">
      <div className="page-header">
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
      
      <div className="page-content">
        <ThreadForm />
      </div>
    </div>
  );
}

export default CreateThreadPage;