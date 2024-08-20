import KakaoShare from '@/components/common/KakaoShare';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {Collection} from '@/lib/types';
import {Heart} from 'lucide-react';
import {Link} from 'react-router-dom';

const DiscoverCard = (props: {collection: Collection}) => {
    const {collection} = props;
    return (
        <>
            <div className="rounded-lg overflow-hidden shadow-sm border-[1px] w-full">
                <Link to={`/collection/${collection.idx}`} className="block">
                    <div className="w-full items-center">
                        <AspectRatio
                            ratio={1 / 1}
                            className="justify-center flex"
                        >
                            <img
                                src={
                                    collection.thumbnailUrl ||
                                    'https://via.placeholder.com/400'
                                }
                                alt={collection.name}
                                className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                            />
                        </AspectRatio>
                    </div>
                </Link>
                <div className="flex flex-wrap items-center justify-between border-y-[1px]">
                    <Button variant={null}>
                        <Heart className="h-6 w-6 mr-2" />
                    </Button>
                    <KakaoShare
                        title={'ONE!T 선물 컬렉션 - ' + collection?.name}
                        description={collection?.description || 'ONE!T'}
                        image={
                            collection.thumbnailUrl ||
                            'https://www.oneit.gift/oneit.png'
                        }
                        url={`https://oneit.gift/collection/${collection?.idx}`}
                    />
                </div>
                <Link to={`/collection/${collection.idx}`} className="block">
                    <div className="p-4">
                        <div className="flex items-center justify-start">
                            <span>{collection.description}</span>
                        </div>
                        <h3 className="max-w-full  text-xl font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                            {collection.name}
                        </h3>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default DiscoverCard;
