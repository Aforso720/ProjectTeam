import { useEffect, useMemo } from "react";

const BASE_URL = "https://project-team.site";

const ensureHeadElement = (selector, createElement) => {
  const head = document.head || document.getElementsByTagName("head")[0];
  let element = head.querySelector(selector);

  if (!element) {
    element = createElement();
    head.appendChild(element);
  }

  return element;
};

const removeHeadElement = (selector) => {
  const head = document.head || document.getElementsByTagName("head")[0];
  const element = head.querySelector(selector);

  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

const updateMetaTag = (name, content, attribute = "name") => {
  if (!content) {
    removeHeadElement(`meta[${attribute}="${name}"]`);
    return;
  }

  const meta = ensureHeadElement(`meta[${attribute}="${name}"]`, () => {
    const metaTag = document.createElement("meta");
    metaTag.setAttribute(attribute, name);
    return metaTag;
  });

  meta.setAttribute("content", content);
};

const updateCanonical = (href) => {
  if (!href) {
    removeHeadElement('link[rel="canonical"]');
    return;
  }

  const link = ensureHeadElement('link[rel="canonical"]', () => {
    const linkTag = document.createElement("link");
    linkTag.setAttribute("rel", "canonical");
    return linkTag;
  });

  link.setAttribute("href", href);
};

const updateStructuredData = (structuredData) => {
  const selector = 'script[type="application/ld+json"][data-seo="structured-data"]';

  if (!structuredData) {
    removeHeadElement(selector);
    return;
  }

  const script = ensureHeadElement(selector, () => {
    const scriptTag = document.createElement("script");
    scriptTag.type = "application/ld+json";
    scriptTag.setAttribute("data-seo", "structured-data");
    return scriptTag;
  });

  script.textContent = JSON.stringify(structuredData);
};

const normaliseUrl = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${BASE_URL}${path}`;
};

const Seo = ({
  title,
  description,
  canonicalPath = "/",
  robots = "index, follow",
  ogType = "website",
  ogTitle,
  ogDescription,
  ogImage,
  ogImageAlt,
  twitterCard = "summary_large_image",
  structuredData,
  additionalMeta = [],
}) => {
  const canonicalUrl = useMemo(() => normaliseUrl(canonicalPath), [canonicalPath]);
  const resolvedOgImage = useMemo(() => normaliseUrl(ogImage), [ogImage]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (title) {
      document.title = title;
    }

    updateCanonical(canonicalUrl);
    updateMetaTag("description", description);
    updateMetaTag("robots", robots);

    updateMetaTag("og:type", ogType, "property");
    updateMetaTag("og:title", ogTitle || title, "property");
    updateMetaTag("og:description", ogDescription || description, "property");
    updateMetaTag("og:url", canonicalUrl, "property");
    updateMetaTag("og:image", resolvedOgImage || undefined, "property");
    updateMetaTag("og:image:alt", ogImageAlt, "property");

    updateMetaTag("twitter:card", twitterCard);
    updateMetaTag("twitter:title", ogTitle || title);
    updateMetaTag("twitter:description", ogDescription || description);
    updateMetaTag("twitter:image", resolvedOgImage || undefined);
    updateMetaTag("twitter:url", canonicalUrl);

    additionalMeta.forEach((meta) => {
      if (!meta || !meta.name || !meta.content) return;
      updateMetaTag(meta.name, meta.content, meta.attribute || "name");
    });

    updateStructuredData(structuredData);

    return () => {
      if (structuredData) {
        updateStructuredData(null);
      }
    };
  }, [
    title,
    description,
    canonicalUrl,
    robots,
    ogType,
    ogTitle,
    ogDescription,
    resolvedOgImage,
    ogImageAlt,
    twitterCard,
    structuredData,
    additionalMeta,
  ]);

  return null;
};

export default Seo;
export { BASE_URL };
