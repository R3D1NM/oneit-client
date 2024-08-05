import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAtom} from 'jotai';
import {ChangeEvent, useRef, useState} from 'react';
import {
    basketName,
    basketDescription,
    basketDeadline,
    thumbnail,
    imageUrl,
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
import {User2Icon} from 'lucide-react';

interface TitleInputProps {
    setCurrentStep: (step: string) => void;
}

const TitleInput = ({setCurrentStep}: TitleInputProps) => {
    const [title, setTitle] = useAtom(basketName);
    const [description, setDescription] = useAtom(basketDescription);
    const [imageURL, setImageURL] = useAtom(imageUrl);
    const [image, setImage] = useAtom(thumbnail);
    const formSchema = z.object({
        title: z.string().min(2, {
            message: '바구니 이름은 2자 이상이어야합니다.',
        }),
        description: z.string().optional(),
        image: z.instanceof(File).optional(),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title,
            description,
        },
    });

    const fileRef = form.register('image');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        console.log(imageURL);

        setTitle(values.title);
        setDescription(values.description || '');
        values.description;
        setCurrentStep('deadline');
        setImage(values.image || null);
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <div className="flex">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>바구니 이름</FormLabel>
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
                        <AvatarImage src={imageURL} className="object-cover" />
                        <AvatarFallback className="bg-secondary">
                            <User2Icon className="w-16 h-16" />
                        </AvatarFallback>
                    </Avatar>
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
                                                    event.target.files![0],
                                                );

                                            setImageURL(displayUrl);
                                            console.log(event);
                                            const file = event.target.files![0];
                                            console.log(file);

                                            field.onChange(file);
                                        }}
                                        type="file"
                                        accept="image/*"
                                        style={{display: 'none'}}
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
                    <Button type="submit">다음</Button>
                </div>
            </form>
        </Form>
    );
};
interface DeadlineInputProps {
    setCurrentStep: (step: string) => void;
}

const DeadlineInput = ({setCurrentStep}: DeadlineInputProps) => {
    const [deadline, setDeadline] = useAtom(basketDeadline);
    const formSchema = z.object({
        deadline: z.date({
            required_error: '날짜를 선택해주세요.',
        }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //     deadline,
        // },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setDeadline(values.deadline);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <FormField
                    control={form.control}
                    name="deadline"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                언제까지 선물을 골라야 하나요?
                            </FormLabel>
                            <FormControl>
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <div className="flex justify-end gap-2">
                    <Button onClick={() => setCurrentStep('title')}>
                        이전
                    </Button>
                    <Button type="submit">만들기</Button>
                </div>
            </form>
        </Form>
    );
};

const CreateBasket = () => {
    const [currentStep, setCurrentStep] = useState('title');

    return (
        <div className="flex flex-col content-center mt-3 w-full justify-center gap-2">
            <p className="text-center">새 바구니 만들기</p>
            {currentStep === 'title' && (
                <TitleInput setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 'deadline' && (
                <DeadlineInput setCurrentStep={setCurrentStep} />
            )}
        </div>
    );
};

export default CreateBasket;
