import React from 'react';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Activity, List } from 'lucide-react';
import { getYearlyData } from './data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

const StatCard = ({ icon, label, value, comparison, backgroundColor }) => (
  <div style={{
    backgroundColor,
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 calc(50% - 10px)',
    marginBottom: '20px',
  }}
  role="region"
  aria-label={label}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
      {React.cloneElement(icon, { size: 24, color: '#4B5563', 'aria-hidden': 'true' })}
      <span style={{ marginLeft: '12px', fontSize: '16px', fontWeight: '500', color: '#4B5563' }}>{label}</span>
    </div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' }}>{value}</div>
    {comparison && (
      <div style={{ fontSize: '14px' }}>
        <span style={{ 
          color: comparison === 'N/A' ? 'gray' : (parseFloat(comparison) > 0 ? 'green' : 'red'),
          fontWeight: 'bold' 
        }}>
          {comparison} rispetto all'anno precedente
        </span>
      </div>
    )}
  </div>
);

const YearlyChart = ({ data, averageTurni }) => {
  const chartData = Object.entries(data).map(([month, { totaleTurni }]) => ({
    name: monthNames[parseInt(month)],
    turniDoppiaggio: totaleTurni
  }));

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginBottom: '20px',
    }}>
      <h3 style={{ marginBottom: '20px', color: '#4B5563' }}>Andamento Annuale dei Turni di Doppiaggio</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="turniDoppiaggio" name="Turni di Doppiaggio" stroke="#8884d8" strokeWidth={2} />
          <ReferenceLine y={averageTurni} stroke="red" strokeDasharray="3 3">
            <Label value="Media Annuale" position="insideTopLeft" fill="red" />
          </ReferenceLine>
        </LineChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#4B5563' }}>
        Media Annuale: {averageTurni.toFixed(2)} turni
      </div>
    </div>
  );
};

const MonthlyListCard = ({ data }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  }}
  role="region"
  aria-label="Lista Mensile dei Turni di Doppiaggio">
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      <List size={24} color='#4B5563' aria-hidden="true" />
      <span style={{ marginLeft: '12px', fontSize: '18px', fontWeight: '500', color: '#4B5563' }}>Lista Mensile dei Turni di Doppiaggio</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Object.entries(data).map(([month, { totaleTurni }]) => (
        <div key={month} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
          <span style={{ color: '#4B5563' }}>{monthNames[parseInt(month)]}</span>
          <span style={{ fontWeight: 'bold', color: '#1F2937' }}>{totaleTurni}</span>
        </div>
      ))}
    </div>
  </div>
);

const calculateComparison = (current, previous) => {
  if (typeof current !== 'number' || typeof previous !== 'number' || previous === 0) {
    return 'N/A';
  }
  const diff = current - previous;
  const percentage = (diff / previous) * 100;
  return percentage > 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
};

const processYearlyData = (data) => {
  if (!data || Object.keys(data).length === 0) return null;
  
  const months = Object.keys(data);
  const totalTurni = months.reduce((sum, month) => sum + (data[month]?.totaleTurni || 0), 0);
  
  const [monthWithMostTurni, monthWithLeastTurni] = months.reduce(([max, min], month) => {
    const turni = data[month]?.totaleTurni || 0;
    return [
      turni > (data[max]?.totaleTurni || 0) ? month : max,
      (turni < (data[min]?.totaleTurni || 0) && turni > 0) ? month : min
    ];
  }, [months[0], months[0]]);

  return {
    totalTurni,
    avgTurni: totalTurni / months.length,
    monthWithMostTurni: {
      month: parseInt(monthWithMostTurni) + 1,
      value: data[monthWithMostTurni]?.totaleTurni || 0
    },
    monthWithLeastTurni: {
      month: parseInt(monthWithLeastTurni) + 1,
      value: data[monthWithLeastTurni]?.totaleTurni || 0
    }
  };
};

const LastYearView = ({ setView, year = new Date().getFullYear() }) => {
  const yearlyData = getYearlyData(year);
  const lastYearData = processYearlyData(yearlyData);
  const previousYearData = processYearlyData(getYearlyData(year - 1));

  if (!lastYearData || !previousYearData) {
    return (
      <div style={{
        backgroundColor: '#F0F9FF',
        minHeight: '100vh',
        padding: '24px',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1>Dati non disponibili</h1>
          <p>Ci scusiamo, ma i dati per l'anno {year} non sono disponibili al momento.</p>
          <button 
            onClick={() => setView('main')} 
            style={{
              background: '#4B5563',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px',
            }}
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      icon: <Calendar />, 
      label: 'Totale Turni di Doppiaggio Annuali', 
      value: lastYearData.totalTurni,
      comparison: calculateComparison(lastYearData.totalTurni, previousYearData.totalTurni),
      backgroundColor: '#E6F3FF'
    },
    { 
      icon: <Activity />, 
      label: 'Media Turni di Doppiaggio Mensile', 
      value: lastYearData.avgTurni.toFixed(1),
      comparison: calculateComparison(lastYearData.avgTurni, previousYearData.avgTurni),
      backgroundColor: '#FFF0E6'
    },
    { 
      icon: <TrendingUp />, 
      label: 'Mese con Più Turni di Doppiaggio', 
      value: `${lastYearData.monthWithMostTurni.value} (${monthNames[lastYearData.monthWithMostTurni.month - 1]})`,
      comparison: calculateComparison(lastYearData.monthWithMostTurni.value, previousYearData.monthWithMostTurni.value),
      backgroundColor: '#FFF0F0'
    },
    { 
      icon: <TrendingDown />, 
      label: 'Mese con Meno Turni di Doppiaggio', 
      value: `${lastYearData.monthWithLeastTurni.value} (${monthNames[lastYearData.monthWithLeastTurni.month - 1]})`,
      comparison: calculateComparison(lastYearData.monthWithLeastTurni.value, previousYearData.monthWithLeastTurni.value),
      backgroundColor: '#F0F0FF'
    },
  ];

  return (
    <div style={{
      backgroundColor: '#F0F9FF',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => setView('main')} 
          style={{
            background: '#4B5563',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
            marginBottom: '24px',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4B5563'}
        >
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Torna alla Dashboard
        </button>
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '8px',
          color: '#1F2937',
        }}>
          Statistiche Anno
        </h1>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '32px',
          color: '#4B5563',
        }}>
          {year}
        </h2>
        
        <YearlyChart data={yearlyData} averageTurni={lastYearData.avgTurni} />
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <MonthlyListCard data={yearlyData} />
      </div>
    </div>
  );
};

export default LastYearView;