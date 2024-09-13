
import Image from "next/image";
import Link from "next/link";

interface ComponenteProps {}

export function Logo({}: ComponenteProps) {

  return  <Link href={"/"}>
            <div className="w-10">
              <Image src="/images/logo.png" width={500} height={500} alt="logo" />
            </div>
          </Link>
}