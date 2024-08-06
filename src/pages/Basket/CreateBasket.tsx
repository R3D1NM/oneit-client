import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAtom, useSetAtom} from 'jotai';
import {ChangeEvent, useRef, useState} from 'react';
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
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {LockKeyhole, LockKeyholeOpen, User2Icon} from 'lucide-react';
import {createBasket} from '@/api/basket';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {useNavigate} from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';

const CreateBasket = () => {
    const [currentStep, setCurrentStep] = useState('title');
    const [error, setError] = useState(false);
    const [title, setTitle] = useAtom(basketName);
    const [description, setDescription] = useAtom(basketDescription);
    const [imageURL, setImageURL] = useAtom(imageUrl);
    const [image, setImage] = useAtom(thumbnail);
    const [access, setAccess] = useAtom(accessStatus);
    const [deadline, setDeadline] = useAtom(basketDeadline);
    const makeBasket = useSetAtom(createBasket);
    const navigate = useNavigate();

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
        deadline: z.date({
            required_error: '날짜를 선택해주세요.',
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
        try {
            const id: number = await makeBasket();
            if (id) {
                navigate(`/basket/${id}`);
            } else {
                throw new Error('바구니 생성에 실패했습니다.');
            }
        } catch (e) {
            console.log(e);
            setError(true);
        }
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
                                <div className="flex">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    바구니 이름
                                                </FormLabel>
                                                <FormMessage />
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="ex) 00의 생일 선물 바구니"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Avatar
                                        className="w-16 border-2 h-16"
                                        onClick={handleAvatarClick}
                                    >
                                        <AvatarImage
                                            src={imageURL}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-secondary">
                                            <User2Icon className="w-16 h-16" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <FormField
                                        control={form.control}
                                        name="access"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormMessage />
                                                <ToggleGroup
                                                    type="single"
                                                    className="flex gap-2"
                                                    onChange={field.onChange}
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
                                        name="image"
                                        render={({field}) => (
                                            <FormItem>
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

                                                            setImageURL(
                                                                displayUrl,
                                                            );
                                                            console.log(event);
                                                            const file =
                                                                event.target
                                                                    .files![0];
                                                            console.log(file);

                                                            field.onChange(
                                                                file,
                                                            );
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
                                </div>
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
                                        onClick={() =>
                                            setCurrentStep('deadline')
                                        }
                                    >
                                        다음
                                    </Button>
                                </div>
                            </>
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
                                        onClick={() => setCurrentStep('title')}
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
            {error && (
                <Dialog open={error} onOpenChange={setError}>
                    <DialogContent
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e: {
                            preventDefault: () => void;
                        }) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>문제 발생</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            문제가 발생했습니다. 다시 시도해주세요.
                        </DialogDescription>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setError(false);
                                    navigate('/');
                                }}
                            >
                                메인으로
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setError(false);
                                }}
                            >
                                다시시도
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default CreateBasket;
