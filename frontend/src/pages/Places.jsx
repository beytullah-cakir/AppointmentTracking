import React, { useState, useEffect } from 'react';
import { placeService } from '../services/api';
import { MapPin, Plus, Trash2, Phone, Tag, Info, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    category: '',
    phone: '',
  });

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await placeService.getAll();
      setPlaces(response.data);
    } catch (error) {
      console.error('Mekanlar yüklenemedi', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await placeService.create(formData);
      fetchPlaces();
      setIsModalOpen(false);
      setFormData({ name: '', description: '', address: '', category: '', phone: '' });
    } catch (error) {
      console.error('Mekan oluşturulamadı', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu mekanı silmek istediğinize emin misiniz?')) return;
    try {
      await placeService.delete(id);
      fetchPlaces();
    } catch (error) {
      console.error('Mekan silinemedi', error);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Mekan <span className="text-primary" style={{ color: 'var(--primary)' }}>Yönetimi</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Randevu alabileceğiniz mekanların listesi.</p>
          </motion.div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.875rem 1.5rem' }}
          >
            <Plus size={20} /> Yeni Mekan Ekle
          </button>
        </div>
      </div>

      {loading && places.length === 0 ? (
        <div className="flex-center" style={{ height: '40vh' }}>
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <AnimatePresence>
            {places.map((place, i) => (
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card"
                style={{ 
                  padding: '2rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  transition: 'transform 0.3s, border-color 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    padding: '0.75rem', 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    borderRadius: '1rem', 
                    color: 'var(--primary)' 
                  }}>
                    <MapPin size={24} />
                  </div>
                  <button 
                    onClick={() => handleDelete(place.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-muted)', 
                      cursor: 'pointer',
                      padding: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--error)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>{place.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                  {place.description || 'Bu mekan için açıklama girilmemiş.'}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.75rem', 
                  paddingTop: '1.5rem', 
                  borderTop: '1px solid var(--border)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Tag size={16} style={{ color: 'var(--primary)' }} />
                    <span>{place.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Phone size={16} style={{ color: 'var(--primary)' }} />
                    <span>{place.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <Info size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{place.address}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="flex-center" style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 1000, 
            background: 'rgba(0,0,0,0.7)', 
            backdropFilter: 'blur(8px)',
            padding: '1rem'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card"
              style={{ maxWidth: '550px', position: 'relative', padding: '3rem' }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ 
                  position: 'absolute', 
                  top: '1.5rem', 
                  right: '1.5rem', 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--text-muted)', 
                  cursor: 'pointer' 
                }}
              >
                <X size={24} />
              </button>

              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>Yeni Mekan Ekle</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="label">Mekan Adı</label>
                  <input
                    required
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="Örn: Kadıköy Kafe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="label">Kategori</label>
                    <input
                      required
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                      placeholder="Restoran, Kuaför vb."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Telefon</label>
                    <input
                      required
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                      placeholder="05..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Adres</label>
                  <input
                    required
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="Mahalle, Sokak, No..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="label">Açıklama</label>
                  <textarea
                    className="input-field"
                    style={{ paddingLeft: '1rem', minHeight: '100px', resize: 'none' }}
                    placeholder="Mekan hakkında kısa bilgi..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="btn-primary"
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white', boxShadow: 'none' }}
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Kaydet'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Places;
