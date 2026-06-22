import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app-shell">
      <section>
        <p className="eyebrow">CMS Frontend</p>
        <h1>React TypeScript foundation is ready.</h1>
        <p>Business screens will be added after the API and domain model are defined.</p>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
