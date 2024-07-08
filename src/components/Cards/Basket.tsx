import { Link, useNavigate } from 'react-router-dom';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Basket = () => {
    const navigate = useNavigate();

    return(
        <>
        <Card className="w-full bg-gradient-to-br from-[#d1d1d1] to-[#f0f0f0] hover:from-[#c8c8c8] hover:to-[#e7e7e7] transition-colors duration-300 rounded-lg h-[30%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <Link to="/basket" className="w-full h-full flex flex-col justify-between">
            <CardHeader className='p-3'>
                <CardTitle>선물 바구니</CardTitle>
                <CardDescription>선물을 담아 보아요!</CardDescription>
            </CardHeader>
            </Link>
        </Card>
        
        </>
    )
}

export default Basket