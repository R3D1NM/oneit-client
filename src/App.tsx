import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Spinner} from '@/components/ui/spinner';
import Header from './components/common/Header';
import NotFound from './pages/NotFound';
import AuthRouter from './components/common/AuthRouter';
import Navbar from '@/components/common/Navbar';
import AddToBasket from './pages/Basket/AddToBasket';
import {Toaster} from './components/ui/sonner';
import {useParams} from 'react-router-dom';
import FakeLogin from './pages/FakeLogin';
import useApiError from './hooks/useApiError';
import {
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

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
const Curation = React.lazy(() => import('./pages/Product/Curation'));
const Product = React.lazy(() => import('./pages/Product/Product'));

const About = React.lazy(() => import('./pages/About'));
const Recommend = React.lazy(() => import('./pages/Recommend/Recommend'));
const Quiz = React.lazy(() => import('./pages/Recommend/Quiz'));
const Results = React.lazy(() => import('./pages/Recommend/Results'));

const Login = React.lazy(() => import('./pages/Login/Login'));
const Auth = React.lazy(() => import('./pages/Login/Auth'));
const SignUp = React.lazy(() => import('./pages/Login/SignUp'));
const Mypage = React.lazy(() => import('./pages/Mypage/Mypage'));
const Friends = React.lazy(() => import('./pages/Mypage/Friends'));

const BasketList = React.lazy(() => import('./pages/Basket/BasketList'));
const Basket = React.lazy(() => import('./pages/Basket/Basket'));
const CreateBasket = React.lazy(() => import('./pages/Basket/CreateBasket'));
const EditBasket = React.lazy(() => import('./pages/Basket/EditBasket'));
const SharedBasket = React.lazy(() => import('./pages/Basket/SharedBasket'));
const BasketInvitation = React.lazy(
    () => import('./pages/Basket/BasketInvitation'),
);

const Discover = React.lazy(() => import('./pages/Discover/Discover'));
const Collection = React.lazy(() => import('./pages/Discover/Collection'));

const Inquiry = React.lazy(() => import('./pages/Inquiry/Inquiry'));
const InquiryChoice = React.lazy(() => import('./pages/Inquiry/InquiryChoice'));
const InquiryResult = React.lazy(() => import('./pages/Inquiry/InquiryResult'));
const AfterInquiry = React.lazy(() => import('./pages/Inquiry/AfterInquiry'));

function App() {
    const {handleError} = useApiError();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 0,
            },
            mutations: {
                onError: handleError,
            },
        },
        queryCache: new QueryCache({
            onError: handleError,
        }),
    });
    return (
        <>
            <QueryClientProvider client={queryClient}>
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
                                                path="/recommend/:chatID/:currentDepth"
                                                element={<Quiz />}
                                            />
                                            <Route
                                                path="/recommend/:chatID/result"
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
                                                path="/collection"
                                                element={<Discover />}
                                            />
                                            <Route
                                                path="/collection/:collectionID"
                                                element={<Collection />}
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
                                            <Route
                                                path="/inquiry/:inquiryID"
                                                element={<Inquiry />}
                                            />
                                            <Route
                                                path="/inquiry/:inquiryID/choice"
                                                element={<InquiryChoice />}
                                            />
                                            <Route
                                                path="/inquiry/:inquiryID/result"
                                                element={<InquiryResult />}
                                            />
                                            <Route
                                                path="/inquiry/after"
                                                element={<AfterInquiry />}
                                            />
                                            <Route
                                                path="/about"
                                                element={<About />}
                                            />
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
                                                path="/signup"
                                                element={
                                                    <AuthRouter
                                                        option={true}
                                                        redirectTo="/"
                                                    >
                                                        <SignUp />
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
                                            <Route
                                                path="/friends"
                                                element={
                                                    <AuthRouter
                                                        option={true}
                                                        redirectTo="/login?redirect=/friends"
                                                    >
                                                        <Friends />
                                                    </AuthRouter>
                                                }
                                            />
                                            {import.meta.env.DEV && (
                                                <Route
                                                    path="/fakeLogin"
                                                    element={<FakeLogin />}
                                                />
                                            )}
                                            <Route
                                                path="/"
                                                element={<Main />}
                                            />
                                            <Route
                                                path="/404"
                                                element={<NotFound />}
                                            />
                                            <Route
                                                path="*"
                                                element={<NotFound />}
                                            />
                                        </Routes>
                                    </Router>
                                </Suspense>
                            </div>
                        </main>
                        <Navbar />
                        <Toaster position="bottom-center" />
                    </div>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default App;
