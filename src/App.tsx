import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Spinner} from '@/components/ui/spinner';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';
import Footer from './components/common/Footer';
import AuthRouter from './components/common/AuthRouter';
import Navbar from '@/components/common/Navbar';
import BasketCard from './pages/Basket/components/BasketCard';

const Main = React.lazy(() => import('./pages/Main/Main'));
const Quiz = React.lazy(() => import('./pages/Recommend/Quiz'));
const Results = React.lazy(() => import('./pages/Recommend/Results'));
const Product = React.lazy(() => import('./pages/Product/Product'));
const Curation = React.lazy(() => import('./pages/Product/Curation'));
const Basket = React.lazy(() => import('./pages/Basket/Basket'));
const About = React.lazy(() => import('./pages/About'));
const Recommend = React.lazy(() => import('./pages/Recommend/Recommend'));
const Login = React.lazy(() => import('./pages/Login'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Mypage = React.lazy(() => import('./pages/Mypage'));
const CreateBasket = React.lazy(() => import('./pages/Basket/CreateBasket'));

function App() {
    return (
        <div className="App flex flex-col justify-center overflow-hidden scrollbar-hide min-h-screen items-center">
            <Header />
            <div className="min-h-svh flex flex-col justify-between max-w-sm items-center w-full scrollbar-hide pt-[5svh] pb-[5svh]">
                <main className="flex w-full justify-center mb-3 mt-2 max-w-sm flex-grow">
                    <div className="flex justify-center w-[90%]">
                        <Suspense fallback={<Spinner size="large" />}>
                            <Router>
                                <Routes>
                                    <Route
                                        path="/recommend"
                                        element={<Recommend />}
                                    />
                                    <Route
                                        path="/quiz/:chatID/:currentDepth"
                                        element={<Quiz />}
                                    />
                                    <Route
                                        path="/result/:chatID"
                                        element={<Results />}
                                    />
                                    <Route
                                        path="/product/:productID"
                                        element={<Product />}
                                    />
                                    <Route
                                        path="/curation"
                                        element={<Curation />}
                                    />
                                    <Route
                                        path="/basket/create"
                                        element={
                                            <AuthRouter
                                                option={true}
                                                redirectTo="/login"
                                            >
                                                <CreateBasket />
                                            </AuthRouter>
                                        }
                                    />
                                    <Route
                                        path="/basket/:basketID"
                                        element={<Basket />}
                                    />
                                    <Route path="/about" element={<About />} />
                                    <Route
                                        path="/login"
                                        element={
                                            <AuthRouter
                                                option={false}
                                                redirectTo="/"
                                            >
                                                <Login />
                                            </AuthRouter>
                                        }
                                    />
                                    <Route
                                        path="/oauth"
                                        element={
                                            <AuthRouter
                                                option={false}
                                                redirectTo="/"
                                            >
                                                <Auth />
                                            </AuthRouter>
                                        }
                                    />
                                    <Route
                                        path="/mypage"
                                        element={
                                            <AuthRouter
                                                option={true}
                                                redirectTo="/login"
                                            >
                                                <Mypage />
                                            </AuthRouter>
                                        }
                                    />
                                    <Route path="/" element={<Main />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Router>
                        </Suspense>
                    </div>
                </main>
                <Navbar />
            </div>
        </div>
    );
}

export default App;
