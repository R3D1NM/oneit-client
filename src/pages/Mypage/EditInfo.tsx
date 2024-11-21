import {authAtom, editUserInfo} from '@/api/auth';
import Header from '@/components/common/Header';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useAtomValue} from 'jotai';
import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import heic2any from 'heic2any';

const EditInfo = () => {
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();
    const [isTransforming, setIsTransforming] = useState(false);
    const queryClient = useQueryClient();
    const [newNickname, setNewNickname] = useState(user?.nickname || '');
    const [imageURL, setImageURL] = useState(user?.profileImg || '');
    const [newBirthDate, setNewBirthDate] = useState(user?.birthDate || '');
    const [image, setImage] = useState<File | null>(null);
    const [birthDateError, setBirthDateError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const EditInfoAPI = useMutation({
        mutationKey: ['editInfo'],
        mutationFn: () =>
            editUserInfo({
                nickname: newNickname,
                profileImage: image,
                // birthDate: newBirthDate.toString(),
            }),
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey:['user']});
            toast('회원 정보가 수정되었습니다.');
            navigate('/mypage', {replace: true});
            window.location.reload();
        },
    });

    const transformFileIfNeeded = async (file: File): Promise<File> => {
        if (file.type === 'image/heic') {
            console.log('heic file detected');
            try {
                const blob = await heic2any({
                    blob: file,
                    toType: 'image/webp',
                });
                const newFile = new File([blob as Blob], file.name + '.webp', {
                    type: 'image/webp',
                });
                console.log(newFile);
                return newFile;
            } catch (err) {
                console.error(err);
                throw new Error('File transformation failed');
            }
        }
        return file;
    };

    const handleSubmit = async () => {
        // const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        // if (!birthDateRegex.test(newBirthDate.toString())) {
        //     setBirthDateError('생년월일은 YYYY-MM-DD 형식이어야 합니다.');
        //     return;
        // }

        // setBirthDateError('');
        let transformedFile = image;
        if (image) {
            setIsTransforming(true);
            try {
                transformedFile = await transformFileIfNeeded(image);
                setImage(transformedFile);
            } catch (error) {
                toast.error('지원하지 않는 이미지 형식입니다.');
                setIsTransforming(false);
                setImageURL(user?.profileImg || '');
                return;
            }
        }

        console.log(newNickname);
        console.log(image);
        EditInfoAPI.mutateAsync();
    };

    return (
        <>
            <Header variant="back" btn_back profile title="내 정보 수정" />
            <div className="mypage2">
                <div className="picture">
                    <img src={imageURL} alt="" />
                    <input
                        type="file"
                        accept="image/*"
                        style={{
                            display: 'none',
                        }}
                        ref={fileInputRef}
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                                if (file.size > 999000000) {
                                    toast.error(
                                        '이미지 용량이 너무 커서 사용할 수 없습니다.',
                                    );
                                    setImage(null);

                                    setImageURL('');
                                    return;
                                }
                                const displayUrl = URL.createObjectURL(file);
                                console.log('Image URL:', displayUrl);
                                setImage(file);

                                if (file && file.type === 'image/heic') {
                                    setImageURL(
                                        'https://placehold.co/400?text=converting...',
                                    );

                                    heic2any({
                                        blob: file,
                                        toType: 'image/webp',
                                    }).then((blob) => {
                                        const newFile = new File(
                                            [blob as Blob],
                                            file?.name + '.webp',
                                            {
                                                type: 'image/webp',
                                            },
                                        );
                                        console.log(newFile);
                                        const displayUrl =
                                            URL.createObjectURL(newFile);
                                        console.log('Image URL:', displayUrl);
                                        setImageURL(displayUrl);
                                        setImage(newFile);
                                    });
                                } else {
                                    setImageURL(displayUrl);
                                }
                            }
                            // setImageURL(displayUrl);
                            // console.log(event);
                            // const file = event.target.files![0];
                            // console.log(file);
                            // if (file) {
                            //     if (file.size > 999000000) {
                            //         toast.error(
                            //             '이미지 용량이 너무 커서 사용할 수 없습니다.',
                            //         );
                            //         setImage(null);
                            //         setImageURL(user?.profileImg || '');
                            //         return;
                            //     }
                            //     // if file is in heic format, convert it to jpeg
                            //     if (file && file.type === 'image/heic') {
                            //         console.log('heic file detected');

                            //         heic2any({
                            //             blob: file,
                            //             toType: 'image/webp',
                            //         }).then((blob) => {
                            //             const newFile = new File(
                            //                 [blob as Blob],
                            //                 file?.name + '.webp',
                            //                 {
                            //                     type: 'image/webp',
                            //                 },
                            //             );
                            //             console.log(newFile);
                            //             const displayUrl =
                            //                 URL.createObjectURL(newFile);
                            //             console.log('Image URL:', displayUrl);
                            //             if (newFile.size > 999000000) {
                            //                 toast.error(
                            //                     '이미지 용량이 너무 커서 사용할 수 없습니다.',
                            //                 );
                            //                 setImage(null);

                            //                 setImageURL(user?.profileImg || '');
                            //                 return;
                            //             }
                            //             setImageURL(displayUrl);
                            //             setImage(newFile);
                            //         });
                            //     } else {
                            //         const displayUrl =
                            //             URL.createObjectURL(file);
                            //         console.log('Image URL:', displayUrl);
                            //         if (file.size > 999000000) {
                            //             toast.error(
                            //                 '이미지 용량이 너무 커서 사용할 수 없습니다.',
                            //             );
                            //             setImage(null);

                            //             setImageURL(user?.profileImg || '');
                            //             return;
                            //         }
                            //         setImageURL(displayUrl);
                            //         setImage(file);
                            //     }
                            // }
                            // setImage(file);
                        }}
                    />
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            fileInputRef.current?.click();
                        }}
                        className="btn_modify"
                    >
                        수정
                    </button>
                </div>

                <div className="input_area">
                    <small>닉네임</small>
                    <input
                        type="text"
                        placeholder="닉네임을 입력해주세요."
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                    />
                    {/* <small>생년월일</small>
                    <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={newBirthDate.toString()}
                        onChange={(e) => setNewBirthDate(e.target.value)}
                    />
                    {birthDateError && (
                        <small style={{color: 'red'}}>{birthDateError}</small>
                    )} */}
                </div>
            </div>
            <div className="btn_area_fixed pl-4 pr-4">
                <button
                    className="btn_pink2"
                    onClick={handleSubmit}
                    disabled={isTransforming}
                >
                    {isTransforming ? '수정 중' : '정보 수정 완료'}
                </button>
            </div>
        </>
    );
};

export default EditInfo;
