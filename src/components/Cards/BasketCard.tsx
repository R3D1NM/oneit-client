import { Link, useNavigate } from 'react-router-dom';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const BasketCard = () => {
    const navigate = useNavigate();

    return(
        <>
        <Card className="w-full bg-gradient-to-br from-oneit-blue to-[#a3dbff] hover:from-[#a3dbff] hover:to-[#98d5fb] transition-colors duration-300 rounded-lg h-[20%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <Link to="/basket" className="w-full h-full flex flex-col justify-between">
            <CardHeader className='p-3'>
                <CardTitle>이 중에 뭐 주지?</CardTitle>
                <CardDescription className='text-oneit-gray'>뭘 좋아할지 몰라서 다 준비해봤어</CardDescription>
            </CardHeader>
            </Link>
        </Card>
        
        </>
    )
}

export default BasketCard