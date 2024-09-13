import React from 'react';
import { ArrowLeft } from 'lucide-react';

const StatisticheFonici = ({ onBack }) => {
  return (
    <div style={{
      backgroundColor: '#F0F9FF',
      minHeight: '100vh',
      padding: '16px',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
    }}>
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: '#4A5568',
            marginBottom: '20px',
          }}
        >
                    <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Torna alla Dashboard
        </button>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#2D3748',
        }}>
          Statistiche Fonici
        </h1>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <p style={{ fontSize: '16px', color: '#4A5568', marginBottom: '20px' }}>
            Qui puoi visualizzare le statistiche relative ai fonici. Al momento, questa è una pagina in fase di sviluppo.
          </p>
          
          {/* Aggiungi qui il contenuto specifico per le statistiche dei fonici */}
          <div style={{ fontSize: '14px', color: '#718096' }}>
            <p>Esempio di statistiche:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              <li>Numero totale di Turni effettuati</li>
              <li>Fonici più attivi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticheFonici;