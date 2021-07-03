import type { StoryData } from "storyblok-js-client";
declare global {
  export interface StoryblokStoryProps {
    story: StoryData;
    preview: boolean;
  }
}
