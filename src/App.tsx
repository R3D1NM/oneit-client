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
import '@/lib/firebase';
import Landing from './Landing';

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
            <AuthRouter option={option} redirectTo={'/main'}>
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
                <div className="App flex flex-col justify-center items-center min-h-screen w-full">
                    <div className="w-[360px]">
                        {/* <Header /> */}
                        <div className="w-full h-full">
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
                                        {/* <Route
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
                                            path="/basket"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/basket"
                                                >
                                                    <BasketList />
                                                </AuthRouter>
                                            }
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
                                        /> */}
                                        {/* <Route
                                            path="/about"
                                            element={<About />}
                                        /> */}
                                        <Route
                                            path="/login"
                                            element={
                                                <AuthRouter
                                                    option={false}
                                                    redirectTo="/main"
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
                                                    redirectTo="/main"
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
                                                    redirectTo="/main"
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
                                        {/* <Route
                                            path="/friends"
                                            element={
                                                <AuthRouter
                                                    option={true}
                                                    redirectTo="/login?redirect=/friends"
                                                >
                                                    <Friends />
                                                </AuthRouter>
                                            }
                                        /> */}
                                        {import.meta.env.DEV && (
                                            <Route
                                                path="/fakeLogin"
                                                element={<FakeLogin />}
                                            />
                                        )}
                                        <Route
                                            path="/main"
                                            element={<Main />}
                                        />
                                        <Route path="/" element={<Landing />} />
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
                    </div>
                </div>
                <footer className="bg-gray-100 p-4">
                    <div className="text-sm text-gray-500">
                        <strong>워닛(ONEIT)</strong>
                        <br />
                        <strong>대표자</strong> 정세연 |{' '}
                        <strong>사업자등록번호</strong>
                        113-30-01641
                        <br />
                        <strong>대표전화</strong> 010-2175-3973 <br />
                        경기도 성남시 분당구 정자일로 1 B동 3503호 <br />
                        <strong>고객 문의</strong> clov3r.gift@gmail.com
                    </div>
                </footer>
                <Toaster position="bottom-center" />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </>
    );
}

export default App;
