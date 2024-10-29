import Accordion from '@/components/Common/CustomComponents/accordian';
import { brutCardVariants } from '@/components/Common/CustomComponents/brut-card';
import { faqList } from '@/data';
import { cn } from '@/utils/tw';

const FAQList = () => {
  return (
    <div className="flex justify-center px-4">
      <div className=" mb-3 mt-[18px] flex w-full max-w-[1075px]">
        <div className={cn(brutCardVariants(), ' divide-y-[1px] divide-font-primary p-0 w-full rounded-sm')}>
          {faqList.map((faq, idx) => (
            <Accordion key={idx} title={faq.title}>
              <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: faq.content }} />
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQList;
