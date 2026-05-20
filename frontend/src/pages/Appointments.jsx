import React, { useState, useEffect } from 'react';
import { appointmentService, placeService } from '../services/api';
import { Calendar, Clock, Plus, Trash2, MapPin, X, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    placeId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [apposRes, placesRes] = await Promise.all([
        appointmentService.getAll(),
        placeService.getAll()
      ]);
      setAppointments(apposRes.data);
      setPlaces(placesRes.data);
    } catch (error) {
      console.error('Veri yüklenemedi', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Backend expects integer for PlaceId
      const dataToSend = {
        ...formData,
        placeId: parseInt(formData.placeId)
      };
      await appointmentService.create(dataToSend);
      fetchData();
      setIsModalOpen(false);
      setFormData({ title: '', description: '', startTime: '', endTime: '', placeId: '' });
    } catch (err) {
      setError(err.response?.data || 'Randevu oluşturulamadı. Seçilen saatlerde mekan dolu olabilir.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Randevuyu iptal etmek istediğinize emin misiniz?')) return;
    try {
      await appointmentService.delete(id);
      fetchData();
    } catch (error) {
      console.error('Randevu silinemedi', error);
    }
  };

  const getPlaceName = (id) => {
    return places.find(p => p.id === id)?.name || 'Bilinmeyen Mekan';
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Randevu <span className="text-primary" style={{ color: 'var(--primary)' }}>Planlayıcı</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Tüm randevularınızı buradan takip edebilirsiniz.</p>
          </motion.div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '0.875rem 1.5rem' }}
          >
            <Plus size={20} /> Yeni Randevu
          </button>
        </div>
      </div>

      {loading && appointments.length === 0 ? (
        <div className="flex-center" style={{ height: '40vh' }}>
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {appointments.map((appo, i) => (
              <motion.div
                key={appo.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card"
                style={{ 
                  padding: '1.5rem 2rem', 
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  gap: '1.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexGrow: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '80px', 
                    height: '80px', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '1.25rem', 
                    border: '1px solid var(--border)' 
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {format(parseISO(appo.startTime), 'MMM', { locale: tr })}
                    </span>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                      {format(parseISO(appo.startTime), 'dd')}
                    </span>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>{appo.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <Clock size={16} style={{ color: 'var(--primary)' }} />
                        <span>{format(parseISO(appo.startTime), 'HH:mm')} - {format(parseISO(appo.endTime), 'HH:mm')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <MapPin size={16} style={{ color: 'var(--primary)' }} />
                        <span>{getPlaceName(appo.placeId)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => handleDelete(appo.id)}
                    style={{ 
                      padding: '0.75rem', 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-muted)', 
                      cursor: 'pointer',
                      borderRadius: '1rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--error)';
                      e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-muted)';
                      e.target.style.background = 'none';
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {appointments.length === 0 && !loading && (
            <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <Calendar style={{ opacity: 0.1, marginBottom: '1.5rem' }} size={80} />
              <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Henüz bir randevu oluşturulmamış.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                İlk randevunu şimdi oluştur
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
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

              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem' }}>Yeni Randevu Oluştur</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="label">Başlık</label>
                  <input
                    required
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="Örn: Proje Toplantısı"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="label">Mekan Seçin</label>
                  <select
                    required
                    className="input-field"
                    style={{ paddingLeft: '1rem', appearance: 'none' }}
                    value={formData.placeId}
                    onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                  >
                    <option value="">Bir mekan seçin...</option>
                    {places.map(place => (
                      <option key={place.id} value={place.id}>{place.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="label">Başlangıç</label>
                    <input
                      required
                      type="datetime-local"
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Bitiş</label>
                    <input
                      required
                      type="datetime-local"
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Notlar</label>
                  <textarea
                    className="input-field"
                    style={{ paddingLeft: '1rem', minHeight: '80px', resize: 'none' }}
                    placeholder="Eklemek istediğiniz notlar..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {error && (
                  <div className="error-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={18} />
                    {error}
                  </div>
                )}

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
                    disabled={loading || places.length === 0}
                    className="btn-primary"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Randevu Oluştur'}
                  </button>
                </div>
                {places.length === 0 && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--warning)', textAlign: 'center' }}>Önce bir mekan eklemelisiniz!</p>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Appointments;
