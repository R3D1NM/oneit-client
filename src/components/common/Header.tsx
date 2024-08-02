import {Button} from '@/components/ui/button';
import {User2} from 'lucide-react';
import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';

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
        <header className=" top-0 bg-white flex min-h-[5svh] items-center w-full justify-between px-4 md:px-6 shadow-md py-1 fixed">
            <div className="flex">
                <a href="/" className="flex items-center justify-center">
                    <span className="text-black text-3xl font-Bayon">
                        One!t
                    </span>
                </a>
            </div>
            <Button variant="ghost" onClick={toMypage}>
                <User2 className="h-6 w-6" />
            </Button>
        </header>
    );
};

export default Header;
