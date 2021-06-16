import { useEffect, useState } from "react";
import StoryblokClient, { StoryData } from "storyblok-js-client";

const TOKEN = String(process.env.STORYBLOK_TOKEN);
console.debug("TOKEN", TOKEN);

const Storyblok = new StoryblokClient({
  accessToken: TOKEN,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

interface StoryblokBridgeInputEvent extends CustomEvent {
  story: StoryData;
  storyId: string;
}

export function useStoryblok(
  originalStory?: StoryData,
  preview?: boolean,
  locale?: string
) {
  let [story, setStory] = useState(originalStory);

  // adds the events for updating the visual editor
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#initializing-the-storyblok-js-bridge
  function initEventListeners() {
    //@ts-ignore
    const { StoryblokBridge } = window;
    if (typeof StoryblokBridge !== "undefined") {
      // initialize the bridge with your token
      const storyblokInstance = new StoryblokBridge();

      // reload on Next.js page on save or publish event in the Visual Editor
      storyblokInstance.on(["change", "published"], () =>
        location.reload(true)
      );

      // live update the story on input events
      storyblokInstance.on("input", (event: StoryblokBridgeInputEvent) => {
        //@ts-ignore
        if (event.story._uid === story._uid) {
          setStory(event.story);
        }
      });

      storyblokInstance.on(
        "enterEditmode",
        (event: StoryblokBridgeInputEvent) => {
          // loading the draft version on initial enter of editor
          Storyblok.get(`cdn/stories/${event.storyId}`, {
            version: "draft",
          })
            .then(({ data }) => {
              if (data.story) {
                setStory(data.story);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      );
    }
  }

  // appends the bridge script tag to our document
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#installing-the-storyblok-js-bridge
  function addBridge(callback: CallableFunction) {
    // check if the script is already present
    const existingScript = document.getElementById("storyblokBridge");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "//app.storyblok.com/f/storyblok-v2-latest.js";
      script.id = "storyblokBridge";
      document.body.appendChild(script);
      script.onload = () => {
        // once the scrip is loaded, init the event listeners
        callback();
      };
    } else {
      callback();
    }
  }

  useEffect(() => {
    // only load inside preview mode
    if (preview) {
      // first load the bridge, then initialize the event listeners
      addBridge(initEventListeners);
    }
  }, []);

  return story;
}

export default Storyblok;
