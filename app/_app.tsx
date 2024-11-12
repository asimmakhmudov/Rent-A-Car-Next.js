import { ReactNode } from 'react';
import { store } from '@/lib/store';
import '../styles/globals.css'; 
import { Provider } from 'react-redux';

function MyApp({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

export default MyApp;
