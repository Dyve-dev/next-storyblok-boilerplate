import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";

// The Storyblok Client & hook
import Storyblok, { useStoryblok } from "../lib/storyblok";
import DynamicComponent from "../src/components/DynamicComponent";

interface IParams extends ParsedUrlQuery {
  slug: string;
}

export default function DynamicPage(props: { [k: string]: any }) {
  const story = useStoryblok(props.story, props.preview);
  console.debug("Dynamic Page props ...slug", props);
  return (
    <div className={styles.container}>
      <Head>
        <title>{story ? story.name : "My Site"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>{story ? story.name : "My Site"}</h1>
        <h2>In catch all slug [...slug]</h2>
      </header>

      <main>
        {story
          ? story.content.body.map((blok: any) => (
              <DynamicComponent blok={blok} key={blok._uid} />
            ))
          : null}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async function (context) {
  console.debug("Context ", context);
  // we need to join the slug on catch all routes
  let slug: string | string[] | undefined;
  if (context.params && context.params.slug) {
    if (Array.isArray(context.params.slug)) {
      slug = context.params.slug.join("/");
    } else {
      slug = context.params.slug;
    }
  }

  let params: { [k: string]: any } = {
    version: "draft", // or 'published'
  };

  if (context.preview) {
    params.version = "draft";
    params.cv = Date.now();
  }

  let { data } = await Storyblok.get(`cdn/stories/${slug}`, params);

  return {
    props: {
      story: data ? data.story : false,
      preview: context.preview || false,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async function () {
  // get all stories inside the pages folder
  let { data } = await Storyblok.get("cdn/links/");
  console.debug("getStaticPaths", data);

  let paths: any = [];
  Object.keys(data.links).forEach((linkKey) => {
    // don't generate route for folders or home entry
    if (data.links[linkKey].is_folder || data.links[linkKey].slug === "home") {
      return;
    }

    // get array for slug because of catch all
    const slug: string[] = data.links[linkKey].slug.split("/");

    // generate page for the slug

    paths.push({ params: { slug } });
  });

  return {
    paths: paths,
    fallback: "blocking",
  };
};
