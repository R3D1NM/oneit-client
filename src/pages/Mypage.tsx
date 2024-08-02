import {logout} from '@/api/auth';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';

const Mypage = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate('/');
    };
    return (
        <div>
            Mypage
            <div>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    );
};

export default Mypage;
