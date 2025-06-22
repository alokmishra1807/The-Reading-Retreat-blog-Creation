import React from "react";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <div className="w-full h-screen flex justify-center flex-col">
      <div className="flex justify-center items-center ">
        <Image src="/home.svg" width={600} height={600} alt="img" />
      </div>
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-6xl md:text-7xl lg:text-9xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
          The Reading Retreat
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
          Discover & Share the better choice, together.
        </p>
        <Link href="/blogs">
          <Button className=" mt-4 text-lg">Start Here</Button>
        </Link>
      </div>
    </div>
  );
}
