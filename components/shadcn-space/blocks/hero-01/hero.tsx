"use client";

import { useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import AnimatedTextRoller from "@/components/Roll";


const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});


export type AvatarList = {
  image: string;
};

type HeroSectionProps = {
  avatarList: AvatarList[];
};

function HeroSection({ avatarList }: HeroSectionProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    if (session?.user) {
      router.push("/dashboard");
    } else {
      signIn("github");
    }
  }, [router, session]);

  return (
    <section>
      <div className="w-full h-full relative">
        <div className="relative w-full pt-0 md:pt-20 pb-6 md:pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-sky-100 before:via-white before:to-amber-100 before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-slate-800 dark:before:via-black dark:before:to-stone-700 dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="lg:text-8xl  md:text-7xl text-5xl font-medium leading-14 md:leading-20 lg:leading-24"
                >
                  Build the Open {" "}
                  Source with{" "}
                  <span
                    className={`${instrumentSerif.className} tracking-tight`}
                  >
                    Stikkle
                  </span>
                </motion.h1>

                <motion.p className="text-md text-foreground "
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}>
                  Stikkle is a cutting-edge open-source platform designed to empower developers and organizations to build, deploy, and manage applications with unparalleled ease and efficiency.
                </motion.p>
                <motion.div
                  className="flex items-center flex-col md:flex-row justify-center gap-8"
                >
                  <Button
                    className="relative text-sm font-medium rounded-full h-12 py-1 group transition-all duration-500 w-fit overflow-hidden cursor-pointer"
                    style={{ paddingLeft: '1.5rem', paddingRight: '3.5rem' }}
                    onClick={handleGetStarted}
                    onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '3.5rem'; e.currentTarget.style.paddingRight = '1.5rem'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '1.5rem'; e.currentTarget.style.paddingRight = '3.5rem'; }}
                  >
                    <span className="relative z-10 transition-all duration-500 whitespace-nowrap">
                      Get Started
                    </span>
                    <span className="">
                      <ArrowUpRight size={16} />
                    </span>
                  </Button>
                  <div className="flex items-center sm:gap-7 gap-3">
                    <ul className="avatar flex flex-row items-center">
                      {avatarList.map((avatar, index) => (
                        <li key={index} className="-mr-2 z-1 avatar-hover:ml-2">
                          <img
                            src={avatar.image}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="rounded-full border-2 border-white"
                          />
                        </li>
                      ))}
                    </ul>
                    <div className="gap-1 flex flex-col items-start">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <img
                            key={index}
                            src="https://images.shadcnspace.com/assets/svgs/icon-star.svg"
                            alt="star"
                            className="h-4 w-4"
                          />
                        ))}
                      </div>
                      <p className="sm:text-sm text-xs font-normal text-muted-foreground">
                        Trusted by 1000+ clients
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
