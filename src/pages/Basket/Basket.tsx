import {fetchBasketInfo} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../NotFound';
import {Button} from '@/components/ui/button';
import {
    CalendarCheck,
    ChevronLeft,
    Heart,
    LockKeyhole,
    Settings,
} from 'lucide-react';
import Share from '@/components/common/Share';

const Basket = () => {
    const {basketID} = useParams();
    const navigate = useNavigate();
    const {data, isLoading, isError} = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });
    console.log(data);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (isLoading) return <Spinner />;
    if (isError) return <NotFound />;

    return (
        <div className="w-full pb-5">
            <div className="flex py-3 flex-wrap items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={handleGoBack}
                >
                    <ChevronLeft className="" />
                </Button>
                {/* <p>{data?.brandName}</p> */}
                <div className="flex">
                    <Button variant="ghost" size="icon">
                        <Heart />
                    </Button>
                    {data?.accessStatus === 'PUBLIC' ? (
                        <Share
                            title="ONE!T"
                            text={data?.name || 'ONE!T'}
                            url={`https://oneit.gift/basket/${data?.idx}`}
                        />
                    ) : (
                        <Button variant="ghost" size="icon">
                            <LockKeyhole />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon">
                        <Settings />
                    </Button>
                </div>
            </div>

            <div className="flex justify-center w-full">
                <img
                    src={data?.imageUrl || 'https://via.placeholder.com/200'}
                    alt="recommended product"
                    // width={200}
                    // height={200}
                    className="object-cover group-hover:opacity-50 transition-opacity"
                />
            </div>
            <div className="py-2 bg-white dark:bg-gray-950">
                <h3 className="text-xl font-bold md:text-xl">{data?.name}</h3>
                <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {data?.description}
                </p>
                <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-500">
                        <CalendarCheck className="inline-block mr-1" />
                        {data?.deadline.toString().split('T')[0]}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Basket;
