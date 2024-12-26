import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Determina a rota do arquivo 
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const url =
      fileExtension === 'pdf'
        ? 'https://apiplanilha.aiatende.dev.br/upload-pdf/'
        : fileExtension === 'csv'
        ? 'https://apiplanilha.aiatende.dev.br/upload-csv/'
        : null;

    if (!url) {
      setError('Formato de arquivo não suportado! Use apenas PDF ou CSV.');
      return;
    }

    try {
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(`Arquivo enviado com sucesso: ${response.data.message || 'Sucesso'}`);
    } catch (err) {
      setError(`Erro ao enviar o arquivo: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Upload de Arquivo</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
        Enviar
      </button>
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '20px' }}>{success}</p>}
    </div>
  );
}

export default App;
