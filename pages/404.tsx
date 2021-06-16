import React from "react";
import DynamicComponent from "../src/components/DynamicComponent";

import { useStoryblok } from "../lib/storyblok";

export default function Page404({ preview, locale, locales }: any) {
  const enableBridge = true; // load the storyblok bridge everywhere
  // const enableBridge = preview; // load only inside preview mode
  const storyLoaded = useStoryblok(undefined, enableBridge, locale);

  let content = <h1>Not found</h1>;
  if (storyLoaded && storyLoaded.content)
    content = <DynamicComponent blok={storyLoaded.content} />;

  return <>{content}</>;
}

export async function getStaticProps({
  locale,
  locales,
  preview = false,
}: any) {
  return {
    props: {
      preview,
      locale,
      locales,
    },
  };
}
