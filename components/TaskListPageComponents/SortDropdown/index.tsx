import { DropdownContainer } from '@/components/Common/DropDown';
import { FontManrope } from '@/utils/typography';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const dropdownOptions = [{ text: 'Most Attempted' }, { text: 'Most Recent' }, { text: 'Least Difficult' }];

export default function SortDropdown() {
  const router = useRouter();
  const { sort } = router.query;

  const updateSorting = useCallback(
    (sortOption: string) => {
      let sortQuery: string;
      switch (sortOption) {
        case 'Most Attempted':
          sortQuery = 'numResults';
          break;
        case 'Most Recent':
          sortQuery = 'createdAt';
          break;
        case 'Least Difficult':
          sortQuery = 'numCriteria';
          break;
        default:
          sortQuery = 'createdAt';
      }
      const newQuery = {
        ...router.query,
        sort: sortQuery,
      };

      router.replace(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  return (
    <DropdownContainer
      buttonText={`Sort By ${sort === 'createdAt' ? 'Most Recent' : sort === 'numCriteria' ? 'Least Difficult' : 'Most Attempted'}`}
      imgSrc="/top-down-arrow.svg"
      dropdownClassName="w-[193.89px]"
      isOpen={false}
      onToggle={function (): void {
        throw new Error('Function not implemented.');
      }}
    >
      <ul className="text-black opacity-75">
        {dropdownOptions.map((option, index) => (
          <li
            key={index}
            className={`px-2 py-[6px] text-base font-semibold text-black opacity-75 ${FontManrope.className} cursor-pointer hover:bg-secondary hover:opacity-100`}
            onClick={() => updateSorting(option.text)}
          >
            {option.text}
          </li>
        ))}
      </ul>
    </DropdownContainer>
  );
}
