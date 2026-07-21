import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Project cards crop to landscape in CSS (`object-cover`). Baking the same
 * aspect into the CDN URL means the editor's hotspot decides what survives the
 * crop, rather than the browser always trimming from the centre.
 */
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 750;

/** Ready-to-render card image, or `undefined` when a project has no screenshot. */
export function cardImageUrl(source: SanityImageSource | undefined) {
  if (!source) return undefined;

  return builder
    .image(source)
    .width(CARD_WIDTH)
    .height(CARD_HEIGHT)
    .fit("crop")
    .auto("format")
    .url();
}
