"use client";

import { Environment } from "@react-three/drei";
import { ConfiguredLightformer, lightformerConfigs } from "./LightformerConfig";

export const Background = () => (
  <Environment background blur={0.75}>
    <color attach="background" args={["black"]} />
    {lightformerConfigs.map((config, index) => (
      <ConfiguredLightformer key={index} config={config} />
    ))}
  </Environment>
);
