import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        setError(errorData.errors.map(e => e.description).join(', '));
      } else if (errorData?.errors) {
        // Handle validation errors (e.g., from [ApiController] validation)
        setError(Object.values(errorData.errors).flat().join(', '));
      } else {
        setError('Kayıt yapılamadı. Sunucuya ulaşılamıyor olabilir.');
      }
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
              <UserPlus className="text-white w-8 h-8" />
            </div>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Hesap Oluştur</h1>
          <p style={{ color: 'var(--text-muted)' }}>Hemen ücretsiz kayıt olun</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Ad Soyad</label>
            <div className="input-wrapper">
              <User className="input-icon" size={20} />
              <input
                type="text"
                required
                className="input-field"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">E-posta Adresi</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                required
                className="input-field"
                placeholder="ornek@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <UserPlus size={20} />
                Kayıt Ol
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="auth-link">
            Giriş Yap
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
