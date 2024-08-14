import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Spinner} from '@/components/ui/spinner';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';
import Footer from './components/common/Footer';
import AuthRouter from './components/common/AuthRouter';
import Navbar from '@/components/common/Navbar';
import AddToBasket from './pages/Basket/AddToBasket';
import {Toaster} from './components/ui/sonner';
import {useParams} from 'react-router-dom';
import FakeLogin from './pages/FakeLogin';

// Custom component to handle dynamic redirect
const AuthRouterWithRedirect = ({
    option,
    children,
    redirectTo,
}: {
    option: boolean | null;
    children: React.ReactNode;
    redirectTo: string;
}) => {
    const {basketID} = useParams();
    if (basketID === undefined) {
        return (
            <AuthRouter option={option} redirectTo={'/'}>
                {children}
            </AuthRouter>
        );
    }

    const redirect = redirectTo.replace(':basketID', basketID);
    return (
        <AuthRouter option={option} redirectTo={redirect}>
            {children}
        </AuthRouter>
    );
};

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
const EditBasket = React.lazy(() => import('./pages/Basket/EditBasket'));
const SharedBasket = React.lazy(() => import('./pages/Basket/SharedBasket'));
const BasketInvitation = React.lazy(
    () => import('./pages/Basket/BasketInvitation'),
);

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
                                                redirectTo="/login?redirect=/basket/create"
                                            >
                                                <CreateBasket />
                                            </AuthRouter>
                                        }
                                    />
                                    <Route
                                        path="/basket/:basketID"
                                        element={
                                            <AuthRouterWithRedirect
                                                option={true}
                                                redirectTo="/login?redirect=/basket/:basketID"
                                            >
                                                <Basket />
                                            </AuthRouterWithRedirect>
                                        }
                                    />
                                    <Route
                                        path="/basket/edit/:basketID"
                                        element={
                                            <AuthRouterWithRedirect
                                                option={true}
                                                redirectTo="/login?redirect=/basket/edit/:basketID"
                                            >
                                                <EditBasket />
                                            </AuthRouterWithRedirect>
                                        }
                                    />
                                    <Route
                                        path="/basket/add/:basketID"
                                        element={
                                            <AuthRouterWithRedirect
                                                option={true}
                                                redirectTo="/login?redirect=/basket/add/:basketID"
                                            >
                                                <AddToBasket />
                                            </AuthRouterWithRedirect>
                                        }
                                    />
                                    <Route
                                        path="/basket/share/:basketID"
                                        element={<SharedBasket />}
                                    />
                                    <Route
                                        path="/basket/:basketID/invite/:inviteID"
                                        element={<BasketInvitation />}
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
                                                redirectTo="/login?redirect=/mypage"
                                            >
                                                <Mypage />
                                            </AuthRouter>
                                        }
                                    />
                                    {import.meta.env.DEV && (
                                        <Route
                                            path="fakeLogin"
                                            element={<FakeLogin />}
                                        />
                                    )}
                                    <Route path="/" element={<Main />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Router>
                        </Suspense>
                    </div>
                </main>
                <Navbar />
                <Toaster position="bottom-center" />
            </div>
        </div>
    );
}

export default App;
