import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/utopai-logo.png" alt="UTOPAI Logo" width={32} height={32} />
            <span className="font-bold text-xl">UTOPAI</span>
          </Link>
          <Button asChild>
            <Link href="https://ko-fi.com/utopai" target="_blank" rel="noopener noreferrer">
              Support Us
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} UTOPAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
