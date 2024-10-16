import React, {useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useMutation} from '@tanstack/react-query';
import {SignUpUser} from '@/lib/types';
import {authAtom, nicknameCheck, signUp} from '@/api/auth';
import {useNavigate} from 'react-router-dom';
import {useAtomValue} from 'jotai';
import {toast} from 'sonner';
import {Button} from '@/components/common/Button';

const SignUp = () => {
    const navigate = useNavigate();
    const user = useAtomValue(authAtom);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2, {message: '이름은 2자 이상이어야 합니다.'}),
        nickname: z
            .string()
            .min(2, {message: '닉네임은 2자 이상이어야 합니다.'}),
        gender: z.enum(['MALE', 'FEMALE']),
        birthYear: z
            .string()
            .regex(/^\d{4}$/, {message: '올바른 연도를 입력해주세요.'}),
        birthMonth: z.string().regex(/^(0?[1-9]|1[012])$/, {
            message: '올바른 월을 입력해주세요.',
        }),
        birthDay: z.string().regex(/^(0?[1-9]|[12][0-9]|3[01])$/, {
            message: '올바른 일을 입력해주세요.',
        }),
    });

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: {errors},
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || '',
            nickname: user?.nickname || '',
            gender: user?.gender || 'MALE',
            birthYear: user?.birthDate
                ? user.birthDate.toString().split('-')[0]
                : '',
            birthMonth: user?.birthDate
                ? user.birthDate.toString().split('-')[1]
                : '',
            birthDay: user?.birthDate
                ? user.birthDate.toString().split('-')[2].split('T')[0]
                : '',
        },
        mode: 'all',
    });

    const nicknameCheckAPI = useMutation({
        mutationFn: (nickname: string) => nicknameCheck(nickname),
        onSuccess: (data) => {
            if (!data.exist) {
                toast.success('사용 가능한 닉네임입니다.');
                setIsNicknameChecked(true);
                clearErrors('nickname');
            } else {
                toast.error('이미 사용 중인 닉네임입니다.');
                setIsNicknameChecked(false);
                setError('nickname', {
                    type: 'manual',
                    message: '이미 사용 중인 닉네임입니다.',
                });
            }
        },
        onError: () => {
            toast.error('닉네임 중복 검사에 실패했습니다.');
            setIsNicknameChecked(false);
        },
    });

    const signupAPI = useMutation({
        mutationFn: async (user: SignUpUser) => {
            return await signUp(user);
        },
        onSuccess: () => {
            const redirect = localStorage.getItem('redirect');
            navigate(redirect || '/');
        },
        onError: () => {
            toast.error('회원가입에 실패했습니다.');
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
        if (!isNicknameChecked) {
            setError('nickname', {
                type: 'manual',
                message: '닉네임 중복 검사를 먼저 진행해주세요.',
            });
            return;
        }
        const birthDate = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;
        signupAPI.mutate({...data, birthDate});
    };

    const checkNickname = (nickname: string) => {
        nicknameCheckAPI.mutate(nickname);
    };

    return (
        <div className="flex-1 p-4">
            <h2 className="font-medium text-xl">간단한 정보를 알려주세요</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-7.5">
                <p className="text-base mb-4 font-medium">이름</p>
                <div className="relative flex w-full h-12 mb-6">
                    <Controller
                        name="name"
                        control={control}
                        render={({field}) => (
                            <input
                                {...field}
                                type="text"
                                placeholder="이름을 입력해주세요."
                                className="border-0 border-b border-gray-300 text-sm flex-1 px-3 py-3.5 placeholder-gray-300 focus:outline-none focus:border-[#ff4bc1] transition-all duration-400"
                            />
                        )}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <p className="text-base mb-4 font-medium mt-6">닉네임</p>
                {errors.nickname && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.nickname.message}
                    </p>
                )}
                <div className="relative flex w-full h-12 mb-6">
                    <Controller
                        name="nickname"
                        control={control}
                        render={({field}) => (
                            <input
                                {...field}
                                type="text"
                                placeholder="닉네임을 입력해주세요."
                                className="border-0 border-b border-gray-300 text-sm flex-1 px-3 py-3.5 placeholder-gray-300 focus:outline-none focus:border-[#ff4bc1] transition-all duration-400"
                            />
                        )}
                    />
                    <Button
                        variant="border"
                        className="w-[6.5625rem] h-[2.1875rem] text-[#ff4bc1] border border-[#ff4bc1] rounded-full absolute top-1/2 -translate-y-1/2 right-0 text-sm font-medium"
                        onClick={() =>
                            checkNickname(control._getWatch('nickname'))
                        }
                    >
                        {isNicknameChecked ? '검사완료' : '중복확인'}
                    </Button>
                </div>

                <p className="text-base mb-4 font-medium mt-6">성별</p>
                <div className="relative w-full mb-6">
                    <div className="w-full flex gap-4">
                        <Controller
                            name="gender"
                            control={control}
                            render={({field}) => (
                                <>
                                    <div className="flex-1">
                                        <input
                                            {...field}
                                            type="radio"
                                            id="select"
                                            value="MALE"
                                            checked={field.value === 'MALE'}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="select"
                                            className={`flex justify-center items-center cursor-pointer h-[2.625rem] w-full border border-[#b1b1b1] rounded-full ${
                                                field.value === 'MALE'
                                                    ? 'text-[#ff4bc1] border-2 border-[#ff4bc1]'
                                                    : 'text-[#3d3d3d] bg-white'
                                            }`}
                                        >
                                            남성
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            {...field}
                                            type="radio"
                                            id="select2"
                                            value="FEMALE"
                                            checked={field.value === 'FEMALE'}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="select2"
                                            className={`flex justify-center items-center cursor-pointer h-[2.625rem] w-full border border-[#b1b1b1] rounded-full ${
                                                field.value === 'FEMALE'
                                                    ? 'text-[#ff4bc1] border-2 border-[#ff4bc1]'
                                                    : 'text-[#3d3d3d] bg-white'
                                            }`}
                                        >
                                            여성
                                        </label>
                                    </div>
                                </>
                            )}
                        />
                    </div>
                    {errors.gender && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.gender.message}
                        </p>
                    )}
                </div>

                <p className="text-base mb-4 font-medium mt-6">생년월일</p>
                <div className="flex gap-4 items-center mb-6">
                    <div className="relative flex-1">
                        <Controller
                            name="birthYear"
                            control={control}
                            render={({field}) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="YYYY"
                                    className="w-full text-center border-0 border-b border-gray-300 text-sm px-3 py-3.5 placeholder-gray-300 focus:outline-none focus:border-[#ff4bc1] transition-all duration-400"
                                />
                            )}
                        />
                    </div>
                    <div className="relative flex-1">
                        <Controller
                            name="birthMonth"
                            control={control}
                            render={({field}) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="MM"
                                    className="w-full text-center border-0 border-b border-gray-300 text-sm px-3 py-3.5 placeholder-gray-300 focus:outline-none focus:border-[#ff4bc1] transition-all duration-400"
                                />
                            )}
                        />
                    </div>
                    <div className="relative flex-1">
                        <Controller
                            name="birthDay"
                            control={control}
                            render={({field}) => (
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="DD"
                                    className="w-full text-center border-0 border-b border-gray-300 text-sm px-3 py-3.5 placeholder-gray-300 focus:outline-none focus:border-[#ff4bc1] transition-all duration-400"
                                />
                            )}
                        />
                    </div>
                </div>
                {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
                    <p className="text-red-500 text-sm mt-1">
                        올바른 생년월일을 입력해주세요.
                    </p>
                )}

                <div className="mt-6">
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full bg-[#ff4bc1] text-white py-3 "
                    >
                        회원가입
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
