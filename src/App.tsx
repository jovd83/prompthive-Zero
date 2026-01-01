import { useState } from 'react';
import { SetupScreen } from '@/components/SetupScreen';
import { Dashboard } from '@/components/Dashboard';

function App() {
    const [isReady, setIsReady] = useState(false);

    if (!isReady) {
        return <SetupScreen onComplete={() => setIsReady(true)} />;
    }

    return <Dashboard />;
}

export default App;
