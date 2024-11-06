import CodegenViewer from '@/components/CodegenViewer';
import { keySliderInteractiveData } from '@/data';
import React, { useEffect, useState } from 'react';

const NewtonsCradle: React.FC = () => {
  const [chaosMode, setChaosMode] = useState(false);
  const [kineticEnergy, setKineticEnergy] = useState(33);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'chaosMode') {
        setChaosMode(event.data.value);
      } else if (event.data.type === 'kineticEnergy') {
        setKineticEnergy(event.data.value);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="z-50 flex size-full min-h-[400px] flex-col items-center justify-center rounded-md border-2 border-black bg-gray-100">
      <div className="relative size-full">
        <CodegenViewer encodedHtml={keySliderInteractiveData.combined_html} />
      </div>
    </div>
  );
};

export default NewtonsCradle;
