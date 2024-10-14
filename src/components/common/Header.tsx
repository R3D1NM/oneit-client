import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import logoImage from '@/assets/logo.svg';
import mypageIcon from '@/assets/icon_mypage.svg';
const Header = () => {
    const isLogin = useAtomValue(isLoginAtom);

    const toMypage = () => {
        if (isLogin) {
            window.location.href = '/mypage';
        } else {
            window.location.href = '/login';
        }
    };
    return (
        <header className="fixed top-0 left-0 right-0 bg-white flex h-14 items-center justify-between px-4 md:px-6 shadow-md z-50">
            <div className="flex items-center">
                <a href="/main" className="flex items-center">
                    <div
                        className="w-[4.75rem] h-[2.125rem] bg-no-repeat bg-center bg-contain"
                        style={{backgroundImage: `url(${logoImage})`}}
                    />
                </a>
            </div>
            <button
                onClick={toMypage}
                className="w-9 h-9 bg-no-repeat bg-center bg-contain"
                style={{backgroundImage: `url(${mypageIcon})`}}
            />
        </header>
    );
};

export default Header;
