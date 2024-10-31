import {Input} from '@/components/ui/input';
import {useAtom, useSetAtom} from 'jotai';
import {useEffect, useRef, useState} from 'react';
import {
    basketName,
    basketDescription,
    basketDeadline,
    thumbnail,
    imageUrl,
    accessStatus,
} from '@/atoms/basket';
import {Calendar} from '@/components/ui/calendar';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {Textarea} from '@/components/ui/textarea';
import {ImageIcon, LockKeyhole, LockKeyholeOpen} from 'lucide-react';
import {createBasket} from '@/api/basket';
import {useNavigate} from 'react-router-dom';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {useMutation} from '@tanstack/react-query';
import Header from '@/components/common/Header';
import {Button} from '@/components/common/Button';
import heic2any from 'heic2any';
import {toast} from 'sonner';

const CreateBasket = () => {
    const [currentStep, setCurrentStep] = useState('title');
    const [title, setTitle] = useAtom(basketName);
    const [description, setDescription] = useAtom(basketDescription);
    const [imageURL, setImageURL] = useAtom(imageUrl);
    const [image, setImage] = useAtom(thumbnail);
    const [access, setAccess] = useAtom(accessStatus);
    const [deadline, setDeadline] = useAtom(basketDeadline);
    const makeBasket = useSetAtom(createBasket);
    const navigate = useNavigate();

    const submitAPI = useMutation({
        mutationFn: makeBasket,
        onSuccess: (data) => {
            navigate(`/basket/create/${data}/after`, {replace: true});
        },
    });

    const formSchema = z.object({
        title: z.string().min(2, {
            message: '바구니 이름은 2자 이상이어야합니다.',
        }),
        description: z.string().optional(),
        image: z.instanceof(File).optional(),
        access: z.enum(['PUBLIC', 'PRIVATE']),
        deadline: z.string().refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime()) && date >= new Date();
            },
            {
                message: '과거의 날짜는 선택할 수 없습니다.',
            },
        ),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title,
            description,
            access,
        },
        mode: 'all',
    });

    const fileRef = form.register('image');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        console.log(imageURL);

        setTitle(values.title);
        setDescription(values.description || '');
        // values.description;
        setCurrentStep('deadline');
        setAccess(values.access);
        setImage(values.image || null);
        console.log(values);
        setDeadline(values.deadline);
        submitAPI.mutate();
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleGoBack = () => {
        if (currentStep == 'title') {
            navigate('/basket', {replace: true});
        } else {
            setCurrentStep((prevStep) => {
                if (prevStep === 'thumbnail') {
                    return 'title';
                } else if (prevStep === 'deadline') {
                    return 'thumbnail';
                }
                return 'title'; // Default return value to ensure a string is always returned
            });
            window.history.pushState(null, '', window.location.href);
        }
    };
    useEffect(() => {
        window.history.pushState({currentStep}, '', window.location.href);
    }, [currentStep]);
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
    }, [currentStep]);

    return (
        <>
            <Header variant="logo" />
            <main className="pt-14 px-4" role="main">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2"
                    >
                        {currentStep === 'title' && (
                            <>
                                <div className="mt-2.5">
                                    <p className="text-2xl font-bold">
                                        소중한 사람을 위한 <br />
                                        선물 바구니를 만들어 보세요!
                                    </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm text-[#5d5d5d] text-center mt-7 mb-1">
                                                바구니 이름
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    autoFocus={true}
                                                    {...field}
                                                    placeholder="바구니 이름을 입력하세요"
                                                    className="mt-6 px-3 h-12 border border-[#d1d1d1] rounded-lg flex items-center placeholder:text-sm placeholder:text-[#d1d1d1]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <div className="flex w-full absolute bottom-2 right-0 p-4">
                                                <Button
                                                    onClick={() => {
                                                        if (
                                                            form.getValues()
                                                                .title.length >
                                                            2
                                                        ) {
                                                            setCurrentStep(
                                                                'thumbnail',
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        field.value.length < 2
                                                    }
                                                    variant={
                                                        field.value.length < 2
                                                            ? 'disabled'
                                                            : 'primary'
                                                    }
                                                    className="w-full "
                                                >
                                                    다음
                                                </Button>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {currentStep === 'thumbnail' && (
                            <>
                                <div className="mt-2.5">
                                    <p className="text-2xl font-bold">
                                        사람들에게 보여줄 바구니 사진을 <br />
                                        설정해주세요.
                                    </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    {...fileRef}
                                                    ref={fileInputRef}
                                                    onChange={(event) => {
                                                        const file =
                                                            event.target
                                                                .files?.[0];
                                                        if (file) {
                                                            // if file is in heic format, convert it to jpeg
                                                            if (
                                                                file &&
                                                                file.type ===
                                                                    'image/heic'
                                                            ) {
                                                                console.log(
                                                                    'heic file detected',
                                                                );

                                                                heic2any({
                                                                    blob: file,
                                                                    toType: 'image/webp',
                                                                }).then(
                                                                    (blob) => {
                                                                        const newFile =
                                                                            new File(
                                                                                [
                                                                                    blob as Blob,
                                                                                ],
                                                                                file?.name +
                                                                                    '.webp',
                                                                                {
                                                                                    type: 'image/webp',
                                                                                },
                                                                            );
                                                                        console.log(
                                                                            newFile,
                                                                        );
                                                                        const displayUrl =
                                                                            URL.createObjectURL(
                                                                                newFile,
                                                                            );
                                                                        console.log(
                                                                            'Image URL:',
                                                                            displayUrl,
                                                                        );
                                                                        if (
                                                                            newFile.size >
                                                                            1048489
                                                                        ) {
                                                                            toast.error(
                                                                                '이미지 용량이 너무 커서 사용할 수 없습니다.',
                                                                            );
                                                                            field.onChange(
                                                                                null,
                                                                            );
                                                                            setImageURL(
                                                                                '',
                                                                            );
                                                                            return;
                                                                        }
                                                                        setImageURL(
                                                                            displayUrl,
                                                                        );
                                                                        field.onChange(
                                                                            newFile,
                                                                        );
                                                                    },
                                                                );
                                                            } else {
                                                                const displayUrl =
                                                                    URL.createObjectURL(
                                                                        file,
                                                                    );
                                                                console.log(
                                                                    'Image URL:',
                                                                    displayUrl,
                                                                );
                                                                if (
                                                                    file.size >
                                                                    1048489
                                                                ) {
                                                                    toast.error(
                                                                        '이미지 용량이 너무 커서 사용할 수 없습니다.',
                                                                    );
                                                                    field.onChange(
                                                                        null,
                                                                    );
                                                                    setImageURL(
                                                                        '',
                                                                    );
                                                                    return;
                                                                }
                                                                setImageURL(
                                                                    displayUrl,
                                                                );
                                                                field.onChange(
                                                                    file,
                                                                );
                                                            }
                                                        }
                                                    }}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{
                                                        display: 'none',
                                                    }}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    variant="border"
                                    className="w-full p-4"
                                    onClick={handleAvatarClick}
                                >
                                    <ImageIcon />
                                    사진 선택
                                </Button>
                                <div className="w-full p-3">
                                    <AspectRatio
                                        ratio={1 / 1}
                                        className="w-full justify-center flex"
                                        onClick={handleAvatarClick}
                                    >
                                        <img
                                            src={
                                                imageURL === ''
                                                    ? 'https://via.placeholder.com/400'
                                                    : imageURL
                                            }
                                            alt={'basket thumbnail'}
                                            className="z-10 w-full h-full object-cover hover:opacity-80 transition-opacity"
                                        />
                                    </AspectRatio>
                                </div>
                                <div className="flex-col w-full gap-2 absolute bottom-2 right-0 p-4">
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() =>
                                                setCurrentStep('title')
                                            }
                                            className="w-full"
                                            variant="border"
                                        >
                                            이전
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setCurrentStep('deadline')
                                            }
                                            className="w-full"
                                            variant={
                                                imageURL === ''
                                                    ? 'disabled'
                                                    : 'primary'
                                            }
                                        >
                                            다음
                                        </Button>
                                    </div>
                                    <button
                                        className="w-full underline text-sm text-[#5d5d5d] pt-2"
                                        onClick={() =>
                                            setCurrentStep('deadline')
                                        }
                                    >
                                        건너뛰기
                                    </button>
                                </div>
                            </>
                        )}
                        {currentStep === 'deadline' && (
                            <>
                                <div className="mt-2.5">
                                    <p className="text-2xl font-bold">
                                        기념일 디데이를 설정해주세요.
                                    </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="deadline"
                                    render={({field}) => (
                                        <FormItem className="">
                                            {/* <FormLabel className="text-sm text-[#5d5d5d] text-center mt-7 mb-1">
                                                기념일 설정
                                            </FormLabel> */}
                                            <FormMessage />
                                            <FormControl className="flex justify-center w-full">
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        field.value
                                                            ? new Date(
                                                                  field.value,
                                                              )
                                                            : undefined
                                                    }
                                                    onSelect={(date) => {
                                                        field.onChange(
                                                            date
                                                                ? formatDate(
                                                                      date,
                                                                  )
                                                                : '',
                                                        );
                                                    }}
                                                />
                                            </FormControl>
                                            <div className="flex w-full gap-2 absolute bottom-2 right-0 p-4">
                                                <Button
                                                    onClick={() =>
                                                        setCurrentStep(
                                                            'thumbnail',
                                                        )
                                                    }
                                                    className="w-full"
                                                    variant="border"
                                                >
                                                    이전
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    variant={
                                                        field.value === null
                                                            ? 'disabled'
                                                            : 'primary'
                                                    }
                                                >
                                                    다음
                                                </Button>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </form>
                </Form>
            </main>
        </>
    );
};

export default CreateBasket;
