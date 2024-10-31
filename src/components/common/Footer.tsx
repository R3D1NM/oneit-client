import {useEffect, useState} from 'react';
import {useLocationContext} from '@/hooks/LocationContext';
import {useAtomValue} from 'jotai';
import {locationAtom} from '@/atoms/etc';

const Footer = () => {
    const [display, setDisplay] = useState(true);
    const path = useAtomValue(locationAtom);

    useEffect(() => {
        if (
            path.includes('basket') ||
            path.includes('product') ||
            path.includes('collection')
        ) {
            setDisplay(false);
        } else {
            setDisplay(true);
        }
    }, [path]);

    return (
        <>
            {display && (
                <footer className="bg-gray-100 p-4">
                    <div className="text-sm text-gray-500">
                        <strong>워닛(ONEIT)</strong> |{' '}
                        <a href="/policy.pdf">개인정보처리방침</a>
                        <br />
                        <strong>대표자</strong> 정세연 |{' '}
                        <strong>사업자등록번호</strong> 113-30-01641
                        <br />
                        <strong>대표전화</strong> 010-2175-3973 <br />
                        경기도 성남시 분당구 정자일로 1 B동 3503호 <br />
                        <strong>고객 문의</strong> clov3r.gift@gmail.com
                    </div>
                </footer>
            )}
        </>
    );
};

export default Footer;
