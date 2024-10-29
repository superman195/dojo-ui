import { retry } from '@/utils/general_helpers';
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import { useCallback, useEffect, useRef, useState } from 'react';

const checkPlyUrl = async (url: string): Promise<boolean> => {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.pathname.toLowerCase().endsWith('.ply')) {
      return false;
    }

    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking PLY URL:', error);
    return false;
  }
};

const useGaussianSplatViewer = (url: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const plyUrl = url.startsWith('https:') ? url : `https://${url}`;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error>();
  const disposeViewer = useCallback(() => {
    if (viewerRef.current && 'dispose' in viewerRef.current) {
      viewerRef.current
        .dispose()
        .then(() => {})
        .catch((err: any) => {
          console.log('error disposing of GS3 viewer:', err);
        });
    }
  }, []);

  useEffect(() => {
    setReady(false);
    let rotationInterval: NodeJS.Timeout;

    const load = async () => {
      await retry(
        async () => {
          if (!viewerRef.current) {
            throw new Error('viewer not loaded');
          }

          if (viewerRef.current.isLoadingOrUnloading()) {
            throw new Error('viewer is still loading');
          }
          const sceneIndex = 0; // Assuming the first scene added
          const scene = viewer.getSplatScene(sceneIndex);

          // Rotate the scene by 45 degrees on the Y-axis
          const angle = Math.PI / 512;
          scene.rotateOnAxis({ x: 0, y: 1, z: 0 }, angle);
          rotationInterval = setInterval(() => {
            scene.rotateOnAxis({ x: 0, y: 1, z: 0 }, angle);
          }, 12);

          setReady(true);
        },
        { maxRetries: 5, delayMs: 500 }
      ).catch((err) => {
        //If it reaches here means max retries exceeded yet still not finish loading
      });
    };
    if (!containerRef.current) {
      console.error('Container ref is null');
      return;
    }
    let viewer: any;
    try {
      //dynamically import gaussian splats 3d
      viewer = new GaussianSplats3D.Viewer({
        cameraUp: [0, 1, 0],
        initialCameraPosition: [0, 0, 7],
        initialCameraLookAt: [0, 0, 0],
        rootElement: containerRef.current,
        sharedMemoryForWorkers: false,
        dynamicScene: true,
      });
      viewerRef.current = viewer;

      viewer
        .addSplatScene(plyUrl, {
          format: GaussianSplats3D.SceneFormat.PLY,
          splatAlphaRemovalThreshold: 5,
          showLoadingUI: true,
          // position: [0, 0, 0],
          rotation: [0, 0, 0, 1],
          scale: [5, 5, 5],
        })
        .then(() => {
          console.log('Splat scene loaded successfully');
          viewer.start();
        })
        .catch((error: Error) => {
          console.error('Error loading splat scene:', error);
          setError(error);
        });
    } catch (err) {}

    // loadViewer(); //This is to init the viewer
    load(); //This is to constantly poll if the viewer is still loading anot

    return () => {
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }

      //   Timeout is set because .dispose will pass a empty reason to abortHandler if it's still loading. This is library's fault.
      //   Workaround is to ensure that the viewer is disposed only after everything is loaded.
      //   By waiting for everything to be loaded, we ensure the viewer is disposed without aborting anything.
      //   Follow up with open issue here: https://github.com/mkkellogg/GaussianSplats3D/issues/247
      if (!viewer) return;
      console.log('Removing viewer');
      viewer.orthographicControls && viewer.orthographicControls.dispose();
      viewer.perspectiveControls && viewer.perspectiveControls.dispose();
      viewer.removeEventHandlers();
      // Remove the container element from the DOM

      setTimeout(() => {
        viewer
          .dispose()
          .then(() => {
            console.log('viewer disposed');
          })
          .catch((err: any) => {
            console.log("Didn't successfully dispose viewer", err);
            //There might be errors disposing but, no problem, it will still get disposed.
          });
      }, 500);
    };
  }, [plyUrl]);

  return {
    containerRef,
    ready,
    error,
    disposeViewer,
    viewerRef,
  };
};

export default useGaussianSplatViewer;
