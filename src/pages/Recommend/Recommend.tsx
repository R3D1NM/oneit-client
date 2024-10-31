import {useForm, Controller, useWatch} from 'react-hook-form';
import {useAtom, useAtomValue} from 'jotai';
import {gender, name, priceRange, recipient} from '@/atoms/recommend';
import {Button} from '@/components/common/Button';

import {startRecommend} from '@/api/chat';
import Header from '@/components/common/Header';
import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {nanoid} from 'nanoid';
import {authAtom} from '@/api/auth';

type FormData = {
    name: string;
    gender: 'MALE' | 'FEMALE';
    recipient: string;
    priceRange: string[];
};

const Recommend = () => {
    const navigate = useNavigate();
    const user = useAtomValue(authAtom);
    const [step, setStep] = useState(0);
    const [nameAtom, setNameAtom] = useAtom(name);
    const [genderAtom, setGenderAtom] = useAtom(gender);
    const [recipientAtom, setRecipientAtom] = useAtom(recipient);
    const [priceRangeAtom, setPriceRangeAtom] = useAtom(priceRange);
    const [{mutate}] = useAtom(startRecommend);

    const handleGoBack = () => {
        if (step > 0) {
            setStep((prevStep) => prevStep - 1);
            window.history.pushState(null, '', window.location.href);
        } else {
            navigate('/main');
        }
    };
    useEffect(() => {
        window.history.pushState({step}, '', window.location.href);
    }, [step]);
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
            handleGoBack();
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [step]);

    const {control, handleSubmit, watch, setValue} = useForm<FormData>({
        defaultValues: {
            name: nameAtom,
            gender: genderAtom,
            recipient: recipientAtom,
            priceRange: priceRangeAtom.length
                ? priceRangeAtom
                : ['0', '300000'], // Set default values if priceRangeAtom is empty
        },
    });

    const onSubmit = async (data: FormData) => {
        setNameAtom(data.name);
        setGenderAtom(data.gender);
        setRecipientAtom(data.recipient);
        setPriceRangeAtom([
            data.priceRange[0].toString(),
            data.priceRange[1].toString(),
        ]);

        console.log('onSubmit', data);

        const chatID = nanoid(10);
        mutate({chatID, userID: user ? user.idx.toString() : ''});
        navigate(`/recommend/${chatID}/0`);
    };

    const nextStep = () => {
        console.log('nextStep', step);
        setStep(step + 1);
    };
    const prevStep = () => {
        console.log('prevStep', step);
        setStep(step - 1);
    };

    const NameGenderPage = () => {
        const watchedName = useWatch({control, name: 'name'});
        const watchedGender = useWatch({control, name: 'gender'});

        return (
            <>
                <div className="flex flex-col ">
                    <p className="text-sm text-[#5d5d5d] text-center mt-7 mb-1">
                        선물받는 분의 성함을 알려주세요
                    </p>
                    <Controller
                        name="name"
                        control={control}
                        rules={{required: true}}
                        render={({field}) => (
                            <input
                                {...field}
                                placeholder="선물 받는 분의 성함을 입력하세요"
                                className="mt-6 px-3 h-12 border border-[#d1d1d1] rounded-lg flex items-center placeholder:text-sm placeholder:text-[#d1d1d1]"
                            />
                        )}
                    />
                </div>
                <div className="flex flex-col mt-12 mb-24">
                    <p className="text-sm text-[#5d5d5d] text-center mt-[4.125rem] mb-6">
                        선물받는 분의 성별을 알려주세요
                    </p>
                    <Controller
                        name="gender"
                        control={control}
                        rules={{required: true}}
                        render={({field}) => (
                            <div className="w-full flex gap-4">
                                {['MALE', 'FEMALE'].map((option) => (
                                    <label
                                        key={option}
                                        className={`flex-1 flex justify-center items-center cursor-pointer h-[2.625rem] border rounded-full bg-white ${
                                            field.value === option
                                                ? 'text-[#ff4bc1] border-2 border-[#ff4bc1]'
                                                : 'text-[#3d3d3d] border-[#b1b1b1]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            {...field}
                                            value={option}
                                            checked={field.value === option}
                                            className="hidden"
                                        />
                                        {option === 'MALE' ? '남성' : '여성'}
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                </div>
                <Button
                    onClick={nextStep}
                    disabled={!watchedName || !watchedGender}
                    className="w-full mt-4"
                    variant={
                        !watchedName || !watchedGender ? 'disabled' : 'primary'
                    }
                >
                    다음
                </Button>
            </>
        );
    };

    const RecipientPage = () => (
        <div className="flex flex-col items-center">
            <p className="text-sm text-[#5d5d5d] text-center mt-7 mb-1">
                선물받는 분과의 관계가 어떻게 되세요?
            </p>
            <Controller
                name="recipient"
                control={control}
                rules={{required: true}}
                render={({field}) => (
                    <div className="flex flex-col w-60 gap-3">
                        {['친구', '부모님', '선생님', '동료', '기타'].map(
                            (option) => (
                                <label
                                    key={option}
                                    className={`flex justify-center items-center cursor-pointer h-[2.625rem] border rounded-full bg-white ${
                                        field.value === option
                                            ? 'text-[#ff4bc1] border-2 border-[#ff4bc1]'
                                            : 'text-[#3d3d3d] border-[#b1b1b1]'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        {...field}
                                        value={option}
                                        checked={field.value === option}
                                        className="hidden"
                                    />
                                    {option}
                                </label>
                            ),
                        )}
                    </div>
                )}
            />
            <div className="flex mt-24 gap-4 w-full">
                <Button onClick={prevStep} className="w-full" variant="border">
                    이전
                </Button>
                <Button
                    onClick={nextStep}
                    disabled={!watch('recipient')}
                    className="w-full"
                    variant={!watch('recipient') ? 'border' : 'primary'}
                >
                    다음
                </Button>
            </div>
        </div>
    );

    const PricePage = () => {
        const minInputRef = useRef<HTMLInputElement>(null);
        const maxInputRef = useRef<HTMLInputElement>(null);
        const minRangeRef = useRef<HTMLInputElement>(null);
        const maxRangeRef = useRef<HTMLInputElement>(null);
        const priceSliderRef = useRef<HTMLDivElement>(null);

        const priceGap = 10000;

        const watchedPriceRange = useWatch({control, name: 'priceRange'});

        useEffect(() => {
            const updateSlider = () => {
                if (
                    minRangeRef.current &&
                    maxRangeRef.current &&
                    priceSliderRef.current
                ) {
                    console.log('updateSlider', watchedPriceRange);

                    const [minVal, maxVal] = watchedPriceRange || [0, 300000];
                    const minPercent = (parseInt(minVal) / 300000) * 100;
                    const maxPercent = 100 - (parseInt(maxVal) / 300000) * 100;
                    priceSliderRef.current.style.left = `${minPercent}%`;
                    priceSliderRef.current.style.right = `${maxPercent}%`;
                }
            };
            updateSlider();
        }, [watchedPriceRange]);

        useEffect(() => {
            const handleRangeInput = (e: Event) => {
                const minVal = parseInt(minRangeRef.current!.value);
                const maxVal = parseInt(maxRangeRef.current!.value);

                if (maxVal - minVal < priceGap) {
                    if (
                        (e.target as HTMLInputElement).className.startsWith(
                            'min-range',
                        )
                    ) {
                        //moved min
                        minRangeRef.current!.value = (
                            maxVal - priceGap
                        ).toString();
                    } else {
                        //moved max
                        maxRangeRef.current!.value = (
                            minVal + priceGap
                        ).toString();
                    }
                } else {
                    minInputRef.current!.value = minVal.toString();
                    maxInputRef.current!.value = maxVal.toString();
                }
                // console.log(minVal, maxVal);
                // setValue('priceRange', [minVal, maxVal]);
            };

            const handlePriceInput = (e: Event) => {
                let minPrice = parseInt(minInputRef.current!.value);
                let maxPrice = parseInt(maxInputRef.current!.value);

                if (minPrice > maxPrice) {
                    [minPrice, maxPrice] = [maxPrice, minPrice];
                    minInputRef.current!.value = minPrice.toString();
                    maxInputRef.current!.value = maxPrice.toString();
                    maxRangeRef.current!.value = maxPrice.toString();
                    minRangeRef.current!.value = minPrice.toString();
                    setValue('priceRange', [
                        minPrice.toString(),
                        maxPrice.toString(),
                    ]);
                }

                if (minPrice < 0) {
                    minInputRef.current!.value = '0';
                    minPrice = 0;
                }
                if (maxPrice > 300000) {
                    maxInputRef.current!.value = '300000';
                    maxPrice = 300000;
                }
                if (
                    maxPrice - minPrice >= priceGap &&
                    maxPrice <= parseInt(maxRangeRef.current!.max)
                ) {
                    if (
                        (e.target as HTMLInputElement).className.startsWith(
                            'min-input',
                        )
                    ) {
                        //entered min
                        minRangeRef.current!.value = minPrice.toString();
                    } else {
                        //endtered max
                        maxRangeRef.current!.value = maxPrice.toString();
                    }
                }
            };

            minRangeRef.current?.addEventListener('input', handleRangeInput);
            maxRangeRef.current?.addEventListener('input', handleRangeInput);
            minInputRef.current?.addEventListener('input', handlePriceInput);
            maxInputRef.current?.addEventListener('input', handlePriceInput);

            return () => {
                minRangeRef.current?.removeEventListener(
                    'input',
                    handleRangeInput,
                );
                maxRangeRef.current?.removeEventListener(
                    'input',
                    handleRangeInput,
                );
                minInputRef.current?.removeEventListener(
                    'input',
                    handlePriceInput,
                );
                maxInputRef.current?.removeEventListener(
                    'input',
                    handlePriceInput,
                );
            };
        }, []);

        return (
            <div className="flex flex-col">
                <p className="text-sm text-[#5d5d5d] text-center mt-[4.125rem] mb-6">
                    선물의 가격대를 입력해주세요.
                </p>
                <div className="flex justify-between text-xs text-[#5d5d5d]">
                    <p>0원</p>
                    <p>30만원</p>
                </div>
                <Controller
                    name="priceRange"
                    control={control}
                    rules={{required: true}}
                    render={({field}) => (
                        <div className="flex flex-col mt-6 w-full">
                            <div className="slider-container relative h-1.5 bg-[#e7e7e7] rounded-md">
                                <div
                                    className="price-slider absolute h-full left-[1/30] right-[1/10] rounded-md bg-gradient-to-b from-[#ff4bc1] to-[#ff4341]"
                                    ref={priceSliderRef}
                                ></div>
                            </div>
                            <div className="range-input relative mt-4">
                                <input
                                    type="range"
                                    className="min-range absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none cursor-pointer top-[-22px]"
                                    min="0"
                                    max="300000"
                                    value={field.value[0]}
                                    step="10000"
                                    ref={minRangeRef}
                                    onChange={(e) =>
                                        field.onChange([
                                            e.target.value,
                                            field.value[1],
                                        ])
                                    }
                                />
                                <input
                                    type="range"
                                    className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none cursor-pointer top-[-22px]"
                                    min="0"
                                    max="300000"
                                    value={field.value[1]}
                                    step="10000"
                                    ref={maxRangeRef}
                                    onChange={(e) =>
                                        field.onChange([
                                            field.value[0],
                                            e.target.value,
                                        ])
                                    }
                                />
                            </div>
                            <div className="price-input flex items-center justify-center gap-3 mt-4">
                                <div className="price-field flex-1 relative">
                                    <input
                                        type="number"
                                        className="min-input w-full h-[2.625rem] rounded-lg border border-[#d1d1d1] text-[#6d6d6d] text-center bg-white px-6"
                                        value={field.value[0]}
                                        ref={minInputRef}
                                        onChange={(e) =>
                                            field.onChange([
                                                e.target.value,
                                                field.value[1],
                                            ])
                                        }
                                    />
                                    <span className="won absolute top-1/2 right-6 transform -translate-y-1/2 text-[#3d3d3d]">
                                        원
                                    </span>
                                </div>
                                <div>~</div>
                                <div className="price-field flex-1 relative">
                                    <input
                                        type="number"
                                        className="w-full h-[2.625rem] rounded-lg border border-[#d1d1d1] text-[#6d6d6d] text-center bg-white px-6"
                                        value={field.value[1]}
                                        ref={maxInputRef}
                                        onChange={(e) =>
                                            field.onChange([
                                                field.value[0],
                                                e.target.value,
                                            ])
                                        }
                                    />
                                    <span className="won absolute top-1/2 right-6 transform -translate-y-1/2 text-[#3d3d3d]">
                                        원
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                />
                <div className="flex mt-48 gap-4 w-full">
                    <Button
                        onClick={prevStep}
                        className="w-full"
                        variant="border"
                    >
                        이전
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        className="w-full"
                        disabled={
                            !watchedPriceRange || watchedPriceRange.length !== 2
                        }
                        variant={
                            !watchedPriceRange || watchedPriceRange.length !== 2
                                ? 'border'
                                : 'primary'
                        }
                    >
                        다음
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <>
            <Header variant="back" />
            <main className="pt-14 px-4" role="main">
                <div className="mt-2.5">
                    <p className="text-sm">
                        선물하고 싶은 분의 정보를 알려주세요.
                    </p>
                    <p className="text-2xl font-bold">
                        딱 맞는 선물을 추천해드릴게요 !
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                    {step === 0 && <NameGenderPage />}
                    {step === 1 && <RecipientPage />}
                    {step === 2 && <PricePage />}
                </form>
            </main>
        </>
    );
};

export default Recommend;
