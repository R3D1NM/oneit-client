import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import logoImage from '@/assets/logo.svg';
import mypageIcon from '@/assets/icon_mypage.svg';
import backIcon from '@/assets/icon_back.svg';
import {useNavigate} from 'react-router-dom';

interface HeaderProps {
    variant: 'logo' | 'back';
}

const Header: React.FC<HeaderProps> = ({variant}) => {
    const isLogin = useAtomValue(isLoginAtom);
    const navigate = useNavigate();

    const toMypage = () => {
        if (isLogin) {
            window.location.href = '/mypage';
        } else {
            window.location.href = '/login';
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white flex h-14 items-center justify-between px-4 z-20">
            <div className="flex items-center">
                {variant === 'logo' ? (
                    <a href="/main" className="flex items-center">
                        <div
                            className="w-[4.75rem] h-[2.125rem] bg-no-repeat bg-center bg-contain"
                            style={{backgroundImage: `url(${logoImage})`}}
                        />
                    </a>
                ) : (
                    <button onClick={handleBack} className="flex items-center">
                        <div
                            className="w-6 h-6 bg-no-repeat bg-center bg-contain"
                            style={{backgroundImage: `url(${backIcon})`}}
                        />
                    </button>
                )}
            </div>
            <button onClick={toMypage} className="w-9 h-9">
                <div
                    className="w-full h-full bg-no-repeat bg-center bg-contain"
                    style={{backgroundImage: `url(${mypageIcon})`}}
                />
            </button>
        </header>
    );
};

export default Header;
