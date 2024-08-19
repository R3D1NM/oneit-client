import {Share2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Toaster, toast} from 'sonner';

interface ShareProps {
    title: string;
    text: string;
    url: string;
}

const Share = (props: ShareProps) => {
    const {title, text, url} = props;

    const onShare = async () => {
        if (navigator.share && navigator.canShare(props)) {
            try {
                await navigator.share({
                    title,
                    text,
                    url,
                });
                // toast('공유 성공')
            } catch (error) {
                // toast('공유 실패')
            }
        } else {
            // console.log('Web Share API not supported');
            try {
                await navigator.clipboard.writeText(url);
                toast('클립보드에 복사되었습니다.');
            } catch (error) {
                toast('공유 기능이 지원되지 않는 브라우저입니다.');
            }
        }
    };

    return (
        <Button variant="ghost" onClick={onShare}>
            <Share2 />
        </Button>
    );
};

export default Share;
