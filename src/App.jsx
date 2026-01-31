import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import StateDemo from './demos/StateDemo';
import EffectDemo from './demos/EffectDemo';
import TransactionsDemo from './demos/TransactionsDemo';
import CDNDemo from './demos/CDNDemo';
import CachingDemo from './demos/CachingDemo';
import HavingVsWhereDemo from './demos/HavingVsWhereDemo';
import RateLimitingDemo from './demos/RateLimitingDemo';
import ConditionalRenderingDemo from './demos/ConditionalRenderingDemo';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToPage = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigateToPage} />;
      case 'state':
        return <StateDemo onBack={() => navigateToPage('home')} />;
      case 'effect':
        return <EffectDemo onBack={() => navigateToPage('home')} />;
      case 'transactions':
        return <TransactionsDemo onBack={() => navigateToPage('home')} />;
      case 'cdn':
        return <CDNDemo onBack={() => navigateToPage('home')} />;
      case 'caching':
        return <CachingDemo onBack={() => navigateToPage('home')} />;
      case 'having-vs-where':
        return <HavingVsWhereDemo onBack={() => navigateToPage('home')} />;
      case 'rate-limiting':
        return <RateLimitingDemo onBack={() => navigateToPage('home')} />;
      case 'conditional-rendering':
        return <ConditionalRenderingDemo onBack={() => navigateToPage('home')} />;
      default:
        return <LandingPage onNavigate={navigateToPage} />;
    }
  };

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
}

export default App;
