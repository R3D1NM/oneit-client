import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';
import {useMutation, useQuery} from '@tanstack/react-query';
import {SignUpUser} from '@/lib/types';
import {authAtom, nicknameCheck, signUp} from '@/api/auth';
import {useNavigate} from 'react-router-dom';
import {useAtomValue} from 'jotai';
import {toast} from 'sonner';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const user = useAtomValue(authAtom);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const nicknameCheckAPI = useMutation({
        mutationFn: (nickname: string) => nicknameCheck(nickname),
        onSuccess: (data) => {
            console.log(data);
            if (!data.exist) {
                toast.success('사용 가능한 닉네임입니다.');
                setIsNicknameChecked(true);
                form.clearErrors('nickname');
            } else {
                toast.error('이미 사용 중인 닉네임입니다.');
                setIsNicknameChecked(false);
                form.setError('nickname', {
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

    if (user?.birthDate && user?.gender && user?.name && user?.nickname) {
        navigate('/');
    }

    // 이름, 닉네임, 비밀번호, 이메일, 전화번호, 생년월일, 성별
    const formSchema = z.object({
        name: z.string().min(2, {message: '이름은 2자 이상이어야 합니다.'}),
        nickname: z
            .string()
            .min(2, {message: '닉네임은 2자 이상이어야 합니다.'}),
        // email: z
        //     .string()
        //     .email({message: '유효한 이메일 주소를 입력해주세요.'}),
        // password: z
        //     .string()
        //     .min(8, {message: '비밀번호는 8자 이상이어야 합니다.'}),
        // phoneNumber: z.string().regex(/^01[0-9]{8,9}$/, {
        //     message: '유효한 전화번호를 입력해주세요.',
        // }),
        birthDate: z.string().refine(
            (value) => {
                if (value === '--') return true;
                const [year, month, day] = value.split('-');
                if (!year || !month || !day) return true;
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            {
                message: '생년월일은 YYYY-MM-DD 형식이어야 합니다.',
            },
        ),
        gender: z.enum(['MALE', 'FEMALE']),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user?.name || '',
            nickname: user?.nickname || '',
            // email: '',
            // password: '',
            // phoneNumber: '',
            birthDate: user?.birthDate
                ? user.birthDate.toString().split('T')[0]
                : '--',
            gender: user?.gender || 'MALE',
        },
        mode: 'all',
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        if (!isNicknameChecked) {
            form.setError('nickname', {
                type: 'manual',
                message: '닉네임 중복 검사를 먼저 진행해주세요.',
            });
            return;
        }
        console.log(data);
        signupAPI.mutate(data);
    };

    const checkNickname = async (nickname: string) => {
        nicknameCheckAPI.mutate(nickname);
    };

    return (
        <div className="flex flex-col content-center mt-3 w-full justify-center gap-2">
            <p className="text-center">ONE!T 회원가입</p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-2"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>이름</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="이름을 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="nickname"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>닉네임</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <div className="flex gap-2">
                                        <Input
                                            {...field}
                                            placeholder="닉네임을 입력하세요"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setIsNicknameChecked(false);
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                checkNickname(field.value)
                                            }
                                            disabled={isNicknameChecked}
                                        >
                                            {isNicknameChecked
                                                ? '검사완료'
                                                : '중복검사'}
                                        </Button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {/* <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>이메일</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="이메일을 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>비밀번호</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}
                    {/* <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>전화번호</FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="전화번호를 입력하세요"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    /> */}
                    <FormField
                        control={form.control}
                        name="birthDate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>생년월일</FormLabel>
                                <FormControl>
                                    <div className="flex space-x-2">
                                        <Select
                                            onValueChange={(value) => {
                                                const [_, month, day] =
                                                    field.value.split('-');
                                                field.onChange(
                                                    `${value}-${month || ''}-${day || ''}`,
                                                );
                                            }}
                                            value={
                                                field.value.split('-')[0] || ''
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="년도" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    {length: 100},
                                                    (_, i) =>
                                                        new Date().getFullYear() -
                                                        i,
                                                ).map((year) => (
                                                    <SelectItem
                                                        key={year}
                                                        value={year.toString()}
                                                    >
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            onValueChange={(value) => {
                                                const [year, _, day] =
                                                    field.value.split('-');
                                                field.onChange(
                                                    `${year || ''}-${value.padStart(2, '0')}-${day || ''}`,
                                                );
                                            }}
                                            value={
                                                field.value.split('-')[1] || ''
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="월" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    {length: 12},
                                                    (_, i) => i + 1,
                                                ).map((month) => (
                                                    <SelectItem
                                                        key={month}
                                                        value={month
                                                            .toString()
                                                            .padStart(2, '0')}
                                                    >
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            onValueChange={(value) => {
                                                const [year, month, _] =
                                                    field.value.split('-');
                                                field.onChange(
                                                    `${year || ''}-${month || ''}-${value.padStart(2, '0')}`,
                                                );
                                            }}
                                            value={
                                                field.value.split('-')[2] || ''
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="일" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    {length: 31},
                                                    (_, i) => i + 1,
                                                ).map((day) => (
                                                    <SelectItem
                                                        key={day}
                                                        value={day
                                                            .toString()
                                                            .padStart(2, '0')}
                                                    >
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </FormControl>
                                {field.value !== '--' &&
                                    field.value
                                        .split('-')
                                        .every((part) => part !== '') && (
                                        <FormMessage />
                                    )}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({field}) => (
                            <FormItem className="flex items-center gap-8">
                                <FormLabel className="min-w-[60px]">
                                    성별
                                </FormLabel>
                                <div className="flex flex-col">
                                    <FormMessage />
                                    <FormControl>
                                        <ToggleGroup
                                            type="single"
                                            onValueChange={(value) => {
                                                if (value) {
                                                    field.onChange(value);
                                                }
                                            }}
                                            value={field.value}
                                            defaultValue={
                                                user?.gender || 'MALE'
                                            }
                                            className="flex gap-2"
                                        >
                                            <ToggleGroupItem
                                                value="MALE"
                                                disabled={
                                                    field.value === 'MALE'
                                                }
                                            >
                                                남성
                                            </ToggleGroupItem>
                                            <ToggleGroupItem
                                                value="FEMALE"
                                                disabled={
                                                    field.value === 'FEMALE'
                                                }
                                            >
                                                여성
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">가입하기</Button>
                </form>
            </Form>
        </div>
    );
};

export default SignUp;
