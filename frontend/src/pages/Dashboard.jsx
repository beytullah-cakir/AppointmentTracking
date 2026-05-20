import React, { useState, useEffect } from 'react';
import { appointmentService, placeService } from '../services/api';
import { Calendar, MapPin, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isAfter, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Veri çekilemedi', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(a => isAfter(parseISO(a.startTime), new Date()))
    .sort((a, b) => parseISO(a.startTime) - parseISO(b.startTime));

  const stats = [
    { label: 'Toplam Randevu', value: appointments.length, icon: Calendar, color: 'text-primary' },
    { label: 'Aktif Mekanlar', value: places.length, icon: MapPin, color: 'text-success' },
    { label: 'Yaklaşan', value: upcomingAppointments.length, icon: Clock, color: 'text-warning' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Genel <span className="text-primary" style={{ color: 'var(--primary)' }}>Bakış</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Randevularınızı ve mekanlarınızı buradan yönetebilirsiniz.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card"
            style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
          >
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '1.25rem', 
              background: 'rgba(255,255,255,0.03)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }} className={stat.color}>
              <stat.icon size={32} />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{stat.label}</p>
              <p style={{ fontSize: '2rem', fontWeight: '700' }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', 
        gap: '2rem' 
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{ padding: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock style={{ color: 'var(--primary)' }} /> Yaklaşan Randevular
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.slice(0, 5).map((appo) => (
                <div key={appo.id} style={{ 
                  padding: '1.25rem', 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: '1.25rem', 
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.3s'
                }}>
                  <div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{appo.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {format(parseISO(appo.startTime), 'd MMMM yyyy, HH:mm', { locale: tr })}
                    </p>
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    padding: '0.375rem 0.75rem', 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    color: 'var(--primary)', 
                    borderRadius: '2rem' 
                  }}>
                    Onaylandı
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <AlertCircle style={{ opacity: 0.2, marginBottom: '1rem' }} size={48} />
                <p>Henüz yaklaşan bir randevunuz yok.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
          style={{ padding: '2rem' }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp style={{ color: 'var(--success)' }} /> Son Aktiviteler
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', marginTop: '0.375rem' }}></div>
              <div>
                <p style={{ fontSize: '0.9375rem' }}>Yeni bir mekan eklendi: <strong>Kadıköy Kafe</strong></p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 saat önce</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', marginTop: '0.375rem' }}></div>
              <div>
                <p style={{ fontSize: '0.9375rem' }}>Randevu tamamlandı: <strong>Proje Toplantısı</strong></p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 saat önce</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)', marginTop: '0.375rem' }}></div>
              <div>
                <p style={{ fontSize: '0.9375rem' }}>Hatırlatma SMS'i gönderildi: <strong>Diş Randevusu</strong></p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dün</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
