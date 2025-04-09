import { FontManrope, FontSpaceMono } from '@/utils/typography';

const RoadMapSection = () => (
  <section
    id="fourth"
    className="z-10"
    style={{
      background: 'linear-gradient(to bottom, #FFFFF4, #E1F5F4)',
    }}
  >
    <div className="mx-auto mt-16 flex max-w-[1075px] flex-col justify-between  md:mt-36 md:flex-row md:px-4 lg:px-4">
      <div className="w-full md:h-full md:w-3/5">
        <h1 className={`${FontSpaceMono.className} text-center text-[46px] font-bold uppercase md:text-left`}>
          DeAI Roadmap
        </h1>
        <p className={`${FontManrope.className} text-center text-lg font-semibold opacity-50 md:text-left`}>
          Our journey to revolutionize AI development
        </p>
      </div>
      <div className="mt-12 flex w-full flex-col px-5 md:mt-0 md:h-full md:w-2/5 md:px-0">
        <div className="flex items-start">
          <div className="mr-8 flex flex-col items-center">
            <div className="flex size-[67px] items-center justify-center rounded-full border-2 border-black shadow-brut-sm">
              <p className={`${FontManrope.className} text-[32px] font-bold`}>v0</p>
            </div>
            <div className="h-32 w-px border-l-[3px] border-dashed border-black/50"></div>
          </div>
          <div>
            <h3 className={`${FontSpaceMono.className} my-4 text-lg font-bold uppercase`}>Testnet launch</h3>
            <ul className="">
              <li className={`${FontManrope.className} mb-2 text-base font-bold opacity-70`}>
                Synthetic Task Generation
              </li>
              <li className={`${FontManrope.className} mb-2 text-base font-bold opacity-70`}>Worker API Model</li>
              <li className={`${FontManrope.className} mb-2 text-base font-bold opacity-70`}>
                Task Completion Interface
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-start">
          <div className="mr-8 flex flex-col items-center">
            <div className="flex size-[67px] items-center justify-center rounded-full border-2 border-black shadow-brut-sm">
              <p className={`${FontManrope.className} text-[32px] font-bold`}>v1</p>
            </div>
            <div className="h-32 w-px border-l-[3px] border-dashed border-black/50"></div>
          </div>
          <div>
            <h3 className={`${FontSpaceMono.className} my-4 text-lg font-bold uppercase`}>MAINNET launch</h3>
            <ul className="">
              <li className={`${FontManrope.className} mb-2 text-base font-bold opacity-70`}>
                Cross-Subnet Integration
              </li>
              <li className={`${FontManrope.className} mb-2 text-base font-bold opacity-70`}>Scoring Refinement</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default RoadMapSection;
