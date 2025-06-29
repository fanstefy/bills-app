import './App.css';
import BillTable from './components/BillTable';
import { useBills } from './hooks/useBills';

function App() {
  const { bills, loading, error } = useBills();

  return (
    <div style={{ padding: '2rem' }}>
      <BillTable bills={bills} loading={loading} error={error} />
    </div>
  );
}

export default App;
