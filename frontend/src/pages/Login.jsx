import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login({ email, password });
      onLogin(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center min-h-screen p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex-center" style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '70px', 
              height: '70px', 
              background: 'var(--primary)', 
              borderRadius: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 30px -10px rgba(99, 102, 241, 0.5)'
            }}>
              <LogIn className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Tekrar Hoşgeldiniz</h1>
          <p style={{ color: 'var(--text-muted)' }}>Randevu takip sistemine giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">E-posta Adresi</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                required
                className="input-field"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Parola</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="error-badge text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <>
                <LogIn size={20} />
                Giriş Yap
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Hesabınız yok mu?{' '}
          <Link to="/register" className="auth-link">
            Hemen Kayıt Ol
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
