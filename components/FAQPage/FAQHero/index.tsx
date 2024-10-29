import { buttonVariants } from '@/components/Common/CustomComponents/button';
import { cn } from '@/utils/tw';
import { FontManrope, FontSpaceMono } from '@/utils/typography';
import { IconBrandDiscord, IconBrandX } from '@tabler/icons-react';
import Link from 'next/link';

const FAQHero = () => {
  return (
    <div className="px-4">
      <div className="relative mx-auto mt-[-116px] flex h-fit max-w-[1075px] justify-between self-center rounded-sm border-2 border-black bg-secondary shadow-brut-sm">
        <div className="px-[29px] py-[21px]">
          <h1 className={`${FontManrope.className} text-lg font-extrabold text-black`}>
            Can&apos;t find what you&apos;re looking for?
          </h1>
          <p className={`${FontManrope.className} mt-3 text-base font-medium text-black/60`}>
            Dojo enables contributions from users of all technical levels to Decentralized AI. If you have any further
            questions or are facing any technical issues, feel free to open a ticket via Discord.
          </p>
          <div className={cn('mt-3 flex gap-[10px]', FontSpaceMono.className)}>
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/TensorplexLabs"
              className={cn(buttonVariants(), 'font-bold capitalize text-white hover:shadow-brut-sm')}
            >
              <IconBrandX /> &nbsp;(Twitter)
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href="https://discord.com/invite/zVZbRdt6U4"
              className={cn(buttonVariants(), 'font-bold capitalize text-white hover:shadow-brut-sm')}
            >
              <IconBrandDiscord className="rounded-full bg-[#7289DA] p-1" /> &nbsp;Discord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQHero;
