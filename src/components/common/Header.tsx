import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

const Header = () => {
  return (
    <header className="fixed top-0 bg-white flex min-h-[5svh] items-center w-full justify-between px-4 md:px-6 shadow-md py-1">
      <div className="flex">
        <a href="/" className="flex items-center justify-center">
          <span className="text-black text-3xl font-Bayon">One!t</span>
        </a>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-auto hover:bg-transparent">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          {/* todo: connect pages */}
          <div className="grid gap-4 p-6">
            <a href="/" >
              Home
            </a>
            <a href="#">
              About
            </a>
            <a href="#" >
              Products
            </a>
            <a href="#" >
              Contact
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

export default Header