import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DEMO_ADMINS = [
  { email: 'shaoshixiong@gmail.com', name: 'Orion' },
  { email: 'mark@locatechs.com', name: 'Mark' },
];

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email);
      navigate('/admin/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoEmail: string) => {
    setEmail(demoEmail);
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Admin Login</h1>
        <p className="login-subtitle">Sign in to access the admin console</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <p>Demo accounts:</p>
          <div className="demo-buttons">
            {DEMO_ADMINS.map((admin) => (
              <button
                key={admin.email}
                type="button"
                className="demo-btn"
                onClick={() => handleDemoClick(admin.email)}
              >
                {admin.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
