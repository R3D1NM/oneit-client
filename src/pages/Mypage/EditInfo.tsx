import {authAtom} from '@/api/auth';
import Header from '@/components/common/Header';
import {useAtom, useAtomValue} from 'jotai';
import React, {useEffect, useRef, useState} from 'react';

const EditInfo = () => {
    const user = useAtomValue(authAtom);
    const [newNickname, setNewNickname] = useState(user?.nickname || '');
    const [imageURL, setImageURL] = useState(user?.profileImgFromKakao || '');
    const [image, setImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    //todo: connect edit info api
    const handleSubmit = () => {
        console.log(newNickname);
        console.log(image);
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
                    {/* <small>전화번호</small>
                    <input type="number" placeholder="010-000-0000" /> */}
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
