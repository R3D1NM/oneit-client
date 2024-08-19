import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Slider} from '@/components/ui/slider';
import {Spinner} from '@/components/ui/spinner';
import {gender, name, priceRange, recipient} from '@/atoms/recommend';
import {useAtom, useSetAtom} from 'jotai';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {nanoid} from 'nanoid';
import {Card, CardContent, CardFooter} from '@/components/ui/card';
import {
    Select,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from '@/components/ui/select';
import {startChat} from '@/api/chat';

const Recommend = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [userName, setUserName] = useAtom(name);
    const [price, setPrice] = useAtom<number[]>(priceRange);
    const [userRecipient, setUserRecipient] = useAtom(recipient);
    const [userGender, setUserGender] = useAtom(gender);

    const start = useSetAtom(startChat);

    const handleStart = async () => {
        const chatID = nanoid(10);
        navigate(`/quiz/${chatID}/0`);
        setLoading(true);
        try {
            await start(chatID);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // End loading
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="flex flex-col content-center w-full gap-2 justify-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl rounded-lg px-3 py-1 w-fit bg-oneit-pink">
                    선물 뭐 주지?
                </h1>
                <span className="px-1 text-oneit-gray">
                    내 소중한 사람은 어떤 선물을 받고 싶어할까요? <br /> ONE!T와
                    함께 어울리는 선물을 찾아봐요!
                </span>
            </div>
            <Card className="py-4 px-2">
                <CardContent className="pb-0 px-2">
                    <div className="flex flex-col pb-2">
                        <p className="text-xl mb-2 pb-0">
                            누구에게 줄 선물인가요?
                        </p>
                        <Input
                            placeholder="이름 또는 별명 (없어도 괜찮아요)"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full"
                        />
                        <div className="flex items-start gap-2 my-2">
                            <div className="flex flex-col w-full">
                                {/* <Label htmlFor='gender' className="my-2">성별</Label> */}
                                <Select
                                    onValueChange={setUserGender}
                                    value={userGender}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={'성별'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="MALE">
                                                남성
                                            </SelectItem>
                                            <SelectItem value="FEMALE">
                                                여성
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col w-full">
                                {/* <Label htmlFor='recipient' className="my-2">관계</Label> */}
                                <Select
                                    onValueChange={setUserRecipient}
                                    value={userRecipient}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={'관계'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="친구">
                                                친구
                                            </SelectItem>
                                            <SelectItem value="애인">
                                                애인
                                            </SelectItem>
                                            <SelectItem value="지인">
                                                지인
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <p className="text-xl mt-1">예산이 어떻게 되나요?</p>
                        <div className=" w-full border-[#FFDDD5] my-2">
                            <Slider
                                id="gift-price"
                                min={0}
                                max={300000}
                                step={10000}
                                value={price}
                                onValueChange={setPrice}
                                className="w-full my-2 pb-2 "
                            />
                            <div className="flex justify-end align-middle w-full">
                                <div className="flex justify-around text-sm ">
                                    <Input
                                        value={price[0].toLocaleString()}
                                        onChange={(e) => {
                                            const value = Number(
                                                e.target.value.replace(
                                                    /,/g,
                                                    '',
                                                ),
                                            );
                                            if (!isNaN(value))
                                                setPrice([
                                                    value <= 500000
                                                        ? value
                                                        : 500000,
                                                    price[1],
                                                ]);
                                        }}
                                        className="w-[30%]"
                                    />
                                    <p className="content-center">원부터</p>
                                    <Input
                                        value={price[1].toLocaleString()}
                                        onChange={(e) => {
                                            const value = Number(
                                                e.target.value.replace(
                                                    /,/g,
                                                    '',
                                                ),
                                            );
                                            if (!isNaN(value))
                                                setPrice([
                                                    price[0],
                                                    value <= 500000
                                                        ? value
                                                        : 500000,
                                                ]);
                                        }}
                                        className="w-[30%]"
                                    />
                                    <p className="content-center">원까지</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CardFooter className="flex justify-end gap-2 mx-0 px-0 mb-0 pb-0">
                        <Button onClick={handleStart} className="w-full mt-2">
                            시작하기
                        </Button>
                    </CardFooter>
                </CardContent>
            </Card>
        </div>
    );
};

export default Recommend;
