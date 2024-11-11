import NavigationBar from '@/components/Common/NavigationBar';
import { FontSpaceMono } from '@/utils/typography';

const DashboardHeader = ({ setShowUserCard }: { setShowUserCard: (show: boolean) => void }) => (
  <div className="h-auto border-b-2 border-black bg-background-accent">
    <NavigationBar openModal={() => setShowUserCard(true)} />
    <h1
      className={`${FontSpaceMono.className}  mb-9 mt-5 text-center text-4xl font-bold tracking-wide text-font-primary`}
    >
      Dashboard
    </h1>
  </div>
);

export default DashboardHeader;
