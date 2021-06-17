import React from "react";
import { GetStaticProps } from "next";

/**
 * Keep this page static for better performances
 * @param param0
 * @returns
 */
export default function Page404({ preview, locale, locales }: any) {
  let content = <h1>404 - Page not found</h1>;

  return <>{content}</>;
}

export const getStaticProps: GetStaticProps = async function ({
  locale,
  locales,
  preview = false,
}) {
  return {
    props: {
      preview: preview || null,
      locale: locale || null,
      locales: locales || null,
    },
  };
};
