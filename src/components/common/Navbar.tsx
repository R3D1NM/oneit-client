import {CompassIcon, HomeIcon, List, PlusIcon, UserIcon} from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed bottom-0 bg-white flex w-full max-w-sm left-1/2 transform -translate-x-1/2 justify-around py-2 border-t z-50">
            <a
                href="/"
                className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            >
                <HomeIcon className="h-6 w-6" />
                <span className="text-xs">Home</span>
            </a>
            <a
                href="#"
                className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            >
                <CompassIcon className="h-6 w-6" />
                <span className="text-xs">Discover</span>
            </a>
            <a
                href="/basket/create"
                className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            >
                <PlusIcon className="h-6 w-6" />
                <span className="text-xs">Create</span>
            </a>
            <a
                href="/curation"
                className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            >
                <List className="h-6 w-6" />
                <span className="text-xs">List</span>
            </a>
            <a
                href="/mypage"
                className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
            >
                <UserIcon className="h-6 w-6" />
                <span className="text-xs">MY</span>
            </a>
        </nav>
    );
};

export default Navbar;
