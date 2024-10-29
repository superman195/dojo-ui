import FrequentlyAccessedItem from '@/components/FAQPage/FrequentlyAccessedItem';
import { TensorplexProducts } from '@/data';
import Layout from '@/layout';
import { ComingSoonProps } from '@/types/CommonTypes';

function ComingSoon({
  mainTitle = 'Coming Soon',
  mainSubTitle = 'Stay tuned for more resources =)',
  type = 'Coming Soon',
  subtitle1 = 'Why not try our other features?',
  subtitle2 = 'Tensorplex applications',
}: ComingSoonProps) {
  return (
    <Layout showFooter={false}>
      <div className=" mb-8 flex h-full max-w-screen-xl flex-col items-center justify-center">
        <div className="mb-10 flex h-[22.5vh] w-full flex-col justify-center text-center">
          <h1 className="font-spacemono pb-4 text-2xl font-bold leading-tight md:text-4xl">{mainTitle}</h1>
          <p className="font-manrope text-md font-medium md:text-xl">{mainSubTitle}</p>
        </div>
        <div className="mt-4 w-4/5 pl-2 md:w-3/5">
          <h1 className="font-spacemono text-start text-base font-bold uppercase md:text-lg">{subtitle2}</h1>
        </div>
        <div className="flex w-4/5 flex-wrap justify-center md:w-3/5 ">
          {TensorplexProducts.map((data, index) => (
            <div key={index} className={`w-full  p-2`}>
              <FrequentlyAccessedItem {...data} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default ComingSoon;
