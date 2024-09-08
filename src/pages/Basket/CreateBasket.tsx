import {Input} from '@/components/ui/input';
import {useAtom, useSetAtom} from 'jotai';
import {useRef, useState} from 'react';
import {
    basketName,
    basketDescription,
    basketDeadline,
    thumbnail,
    imageUrl,
    accessStatus,
} from '@/atoms/basket';
import {Button} from '@/components/ui/button';
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
import {LockKeyhole, LockKeyholeOpen} from 'lucide-react';
import {createBasket} from '@/api/basket';
import {useNavigate} from 'react-router-dom';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {useMutation} from '@tanstack/react-query';

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
            navigate(`/basket/${data}`, {replace: true});
        },
    });

    const formSchema = z.object({
        title: z
            .string()
            .min(2, {
                message: '바구니 이름은 2자 이상이어야합니다.',
            })
            .max(10, {
                message: '바구니 이름은 10자 이하여야합니다.',
            }),
        description: z.string().optional(),
        image: z.instanceof(File).optional(),
        access: z.enum(['PUBLIC', 'PRIVATE']),
        deadline: z
            .date({
                required_error: '날짜를 선택해주세요.',
            })
            .min(new Date(), {
                message: '과거의 날짜는 선택할 수 없습니다.',
            }),
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
        values.description;
        setCurrentStep('deadline');
        setAccess(values.access);
        setImage(values.image || null);
        console.log(values);
        setDeadline(values.deadline);
        submitAPI.mutate();
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <>
            <div className="flex flex-col content-center mt-3 w-full justify-center gap-2">
                <p className="text-center">새 바구니 만들기</p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-2"
                    >
                        {currentStep === 'title' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>바구니 이름</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <Input
                                                    autoFocus={true}
                                                    {...field}
                                                    placeholder="ex) 00의 생일 선물 바구니"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="access"
                                    render={({field}) => (
                                        <FormItem className="flex justify-start gap-5 items-center">
                                            <div className="flex flex-col">
                                                <FormLabel>
                                                    바구니 공개 여부
                                                </FormLabel>
                                                {/* <FormMessage /> */}
                                            </div>
                                            <ToggleGroup
                                                type="single"
                                                className="flex gap-2"
                                                onValueChange={(value) => {
                                                    if (
                                                        value === 'PUBLIC' ||
                                                        value === 'PRIVATE'
                                                    )
                                                        field.onChange(value);
                                                }}
                                                defaultValue={field.value}
                                            >
                                                <ToggleGroupItem
                                                    value="PUBLIC"
                                                    size="sm"
                                                >
                                                    <LockKeyholeOpen />
                                                </ToggleGroupItem>
                                                <ToggleGroupItem
                                                    value="PRIVATE"
                                                    size="sm"
                                                >
                                                    <LockKeyhole />
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                바구니 설명 <span>(선택)</span>
                                            </FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <Textarea
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="선물의 목적이나 바구니에 담을 선물을 설명해주세요"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => {
                                            if (
                                                form.getValues().title.length >
                                                2
                                            ) {
                                                setCurrentStep('thumbnail');
                                            }
                                        }}
                                    >
                                        다음
                                    </Button>
                                </div>
                            </>
                        )}
                        {currentStep === 'thumbnail' && (
                            <div>
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                바구니 대표 이미지 (선택)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...fileRef}
                                                    ref={fileInputRef}
                                                    onChange={(event) => {
                                                        const displayUrl: string =
                                                            URL.createObjectURL(
                                                                event.target
                                                                    .files![0],
                                                            );

                                                        setImageURL(displayUrl);
                                                        console.log(event);
                                                        const file =
                                                            event.target
                                                                .files![0];
                                                        console.log(file);

                                                        field.onChange(file);
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
                                <div className="w-full p-3">
                                    <AspectRatio
                                        ratio={1 / 1}
                                        className="w-full justify-center flex"
                                        onClick={handleAvatarClick}
                                    >
                                        <img
                                            src={
                                                imageURL ||
                                                'https://via.placeholder.com/400'
                                            }
                                            alt={'basket thumbnail'}
                                            className="z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                                        />
                                    </AspectRatio>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={() => setCurrentStep('title')}
                                    >
                                        이전
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setCurrentStep('deadline')
                                        }
                                    >
                                        다음
                                    </Button>
                                </div>
                            </div>
                        )}
                        {currentStep === 'deadline' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="deadline"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>
                                                언제까지 선물을 골라야 하나요?
                                            </FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                ></FormField>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={() =>
                                            setCurrentStep('thumbnail')
                                        }
                                    >
                                        이전
                                    </Button>
                                    <Button type="submit">만들기</Button>
                                </div>
                            </>
                        )}
                    </form>
                </Form>
            </div>
        </>
    );
};

export default CreateBasket;
