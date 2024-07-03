import React, {Suspense } from 'react';
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';

const Main = React.lazy(() => import('./pages/Main'));
const Quiz = React.lazy(()=> import('./pages/Quiz'))
const Results = React.lazy(()=> import('./pages/Results'))

function App() {
  return (
    <div className="App h-svh flex flex-col justify-between">
      <Header/>
      <main className='max-h-[90svh] flex w-svw justify-center mb-3 mt-3'>
        <div className='flex justify-center w-[80%] '>
        {/* <AtomsDevtools> */}
          <Suspense fallback={<Spinner size="large" />}>
          {/* <Provider> */}
            <Router>
                <Routes>
                    <Route path="/quiz/:chatID/:currentDepth" element={<Quiz/>} />
                    <Route path="/result/:chatID" element={<Results/>} />
                    <Route path="/" element={<Main/>}/>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
          {/* </Provider> */}
          </Suspense>
        {/* </AtomsDevtools> */}
        </div>
      </main>
      <footer className='bg-slate-100 text-xs justify-evenly flex flex-col font-light items-center min-h-[5svh]'>
        <p>Created by Team.CLOV3R</p>
        {/* <p>Powerd by chatGPT</p> */}
      </footer>
    </div>
  );
}

export default App;
