import { useContext } from 'react';
import { useThree } from '@react-three/fiber';
import { Suspense } from 'react';
import { Physics } from "@react-three/rapier";
import Band from '../Band';
import Background from '../Background';
import { ViewportContext, MOBILE_OFFSET, DESKTOP_OFFSET, useViewport } from './state';

const BandWrapper = () => {
  const { viewport } = useThree();
  const { isMobile } = useContext(ViewportContext);

  const xOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET;
  const xPosition = viewport.width * xOffset - (isMobile ? 0 : viewport.width / 2);

  return <Band position={[xPosition, 4, 0]} />;
};

const SceneContent = () => {
  const { isVisible } = useContext(ViewportContext);

  if (!isVisible) return null;

  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <BandWrapper />
    </Physics>
  );
};

export const ViewportManager = () => {
  const viewportState = useViewport();

  return (
    <ViewportContext.Provider value={viewportState}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Background />
        <SceneContent />
      </Suspense>
    </ViewportContext.Provider>
  );
}; 