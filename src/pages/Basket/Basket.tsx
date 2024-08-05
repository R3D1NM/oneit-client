import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {Link} from 'react-router-dom';

const Basket = () => {
    return (
        <div className="flex flex-col content-center mt-3 w-full justify-center gap-2">
            <Card className="w-full bg-gradient-to-br from-oneit-blue to-[#a3dbff] hover:from-[#a3dbff] hover:to-[#98d5fb] transition-colors duration-300 rounded-lg h-fit flex flex-col justify-between shadow-md border-0 max-w-md">
                <Link
                    to="/basket/create"
                    className="w-full h-full flex flex-col justify-between"
                >
                    <CardHeader className="p-3">
                        <CardTitle>새 선물 바구니 만들기</CardTitle>
                    </CardHeader>
                </Link>
            </Card>
            <div> Basket List</div>
        </div>
    );
};

export default Basket;
