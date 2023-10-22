"use client";
import React from "react";
import Typewriter from "typewriter-effect";

type Props = {};

const TypewriterTitle = (props: Props) => {
  return (
    <Typewriter
      options={{
        loop: true,
      }}
      onInit={(typewriter) => {
        typewriter
          .changeDelay(35)
          .changeDeleteSpeed("natural")
          .typeString("You have the idea,")
          .pauseFor(500)
          .typeString(" it helps you grow it.")
          .pauseFor(1000)
          .deleteAll()
          .typeString("Defeat Writers Block.")
          .pauseFor(1000)
          .deleteAll()
          .typeString("AI-Powered Insights.")
          .pauseFor(1000)
          .start();
      }}
    />
  );
};

export default TypewriterTitle;