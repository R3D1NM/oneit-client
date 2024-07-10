import React, {Suspense } from 'react';
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import Footer from './components/common/Footer';

const Main = React.lazy(() => import('./pages/Main'));
const Quiz = React.lazy(()=> import('./pages/Quiz'))
const Results = React.lazy(()=> import('./pages/Results'))
const Product = React.lazy(()=> import('./pages/Product'))
const Curation = React.lazy(()=> import('./pages/Curation'))

function App() {

  // const fetchTodo = async () => {
  //   return (await axios.get('/todos/1')).data
  // }
  // const {data} = useQuery({queryKey:['todo'],queryFn:fetchTodo})
  // console.log(data)


  return (
    <div className='App flex flex-col justify-center overflow-x-hidden scrollbar-hide min-h-screen items-center'>
      <div className="h-svh flex flex-col justify-between max-w-sm items-center w-full">
        <Header/>
        <main className='flex w-full justify-center mb-3 mt-[7vh] max-w-sm  flex-grow'>
          <div className='flex justify-center w-[90%]'>
            <Suspense fallback={<Spinner size="large" />}>
              <Router>
                  <Routes>
                      <Route path="/quiz/:chatID/:currentDepth" element={<Quiz/>} />
                      <Route path="/result/:chatID" element={<Results/>} />
                      <Route path='/product/:productID' element={<Product/>}/>
                      <Route path='/curation' element={<Curation/>}/>
                      <Route path="/" element={<Main/>}/>
                      <Route path="*" element={<NotFound />} />
                  </Routes>
              </Router>
            </Suspense>
          </div>
        </main>
        <Footer/>
      </div>
    </div>
  );
}

export default App;
