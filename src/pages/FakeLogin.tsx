import {updateAuthAtom} from '@/api/auth';
import {Button} from '@/components/ui/button';
import {useSetAtom} from 'jotai';

const FakeLogin = () => {
    const login = useSetAtom(updateAuthAtom);
    const handleLogin = async () => {
        localStorage.setItem(
            'token',
            `${import.meta.env.VITE_FAKE_LOGIN_TOKEN}`,
        );
        await login();
        window.location.href = '/main';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
    };

    const handleLogin2 = async () => {
        localStorage.setItem(
            'token',
            `${import.meta.env.VITE_FAKE_LOGIN_TOKEN2}`,
        );
        await login();
        window.location.href = '/main';
    };

    return (
        <div>
            <Button onClick={handleLogin}>TESTER로 로그인</Button>
            <Button onClick={handleLogin2}>TESTER2로 로그인</Button>
            <Button onClick={handleLogout}>로그아웃</Button>
        </div>
    );
};

export default FakeLogin;
