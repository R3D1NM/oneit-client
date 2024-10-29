import {authAtom, editUserInfo} from '@/api/auth';
import Header from '@/components/common/Header';
import {useMutation} from '@tanstack/react-query';
import {useAtomValue} from 'jotai';
import React, {useRef, useState} from 'react';

const EditInfo = () => {
    const user = useAtomValue(authAtom);
    const [newNickname, setNewNickname] = useState(user?.nickname || '');
    const [imageURL, setImageURL] = useState(user?.profileImgFromKakao || '');
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
                birthDate: newBirthDate.toString(),
            }),
    });

    const handleSubmit = () => {
        const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!birthDateRegex.test(newBirthDate.toString())) {
            setBirthDateError('생년월일은 YYYY-MM-DD 형식이어야 합니다.');
            return;
        }

        setBirthDateError('');
        console.log(newNickname);
        console.log(image);
        EditInfoAPI.mutate();
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
                            const displayUrl: string = URL.createObjectURL(
                                event.target.files![0],
                            );

                            setImageURL(displayUrl);
                            console.log(event);
                            const file = event.target.files![0];
                            console.log(file);

                            setImage(file);
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
                    <small>생년월일</small>
                    <input
                        type="text"
                        placeholder="YYYY-MM-DD"
                        value={newBirthDate.toString()}
                        onChange={(e) => setNewBirthDate(e.target.value)}
                    />
                    {birthDateError && (
                        <small style={{color: 'red'}}>{birthDateError}</small>
                    )}
                </div>
            </div>
            <div className="btn_area_fixed pl-4 pr-4">
                <button className="btn_pink2" onClick={handleSubmit}>
                    정보 수정 완료
                </button>
            </div>
        </>
    );
};

export default EditInfo;
