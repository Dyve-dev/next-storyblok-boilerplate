import SbEditable from "storyblok-react";
import Teaser from "./Teaser";
import Grid from "./Grid";
import Feature from "./Feature";

// resolve Storyblok components to Next.js components
const Components = {
  teaser: Teaser,
  grid: Grid,
  feature: Feature,
};

const DynamicComponent = ({ blok }: any) => {
  // check if component is defined above
  //@ts-ignore
  if (typeof Components[blok.component] !== "undefined") {
    //@ts-ignore
    const Component = Components[blok.component];
    // wrap with SbEditable for visual editing
    return (
      <SbEditable content={blok}>
        <Component blok={blok} />
      </SbEditable>
    );
  }

  // fallback if the component doesn't exist
  return (
    <p>
      The component <strong>{blok.component}</strong> has not been created yet.
    </p>
  );
};

export default DynamicComponent;
