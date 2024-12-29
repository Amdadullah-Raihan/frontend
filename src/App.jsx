import { BrowserRouter } from 'react-router-dom';
import Routers from './Routes';
import { Toaster } from 'react-hot-toast';
import { MainContextProvider } from './context/Index';

function App() {
  return (
    <BrowserRouter>
      <MainContextProvider>
        <Toaster />
        <Routers />
      </MainContextProvider>
    </BrowserRouter>
  );
}

export default App;
