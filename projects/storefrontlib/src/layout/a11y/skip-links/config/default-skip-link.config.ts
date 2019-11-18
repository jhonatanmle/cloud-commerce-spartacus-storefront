import { SkipLinkConfig, SkipLinkScrollPosition } from './skip-link.config';

export const defaultSkipLinkConfig: SkipLinkConfig = {
  skipLinks: [
    {
      slot: 'SiteContext',
      i18nKey: 'groupSkipper.titles.header',
    },
    {
      slot: 'BottomHeaderSlot',
      position: SkipLinkScrollPosition.AFTER,
      i18nKey: 'groupSkipper.titles.main',
      excludeOnTemplate: ['Product List'],
    },
    {
      slot: 'ProductLeftRefinements',
      i18nKey: 'groupSkipper.titles.productFacets',
    },
    {
      slot: 'ProductListSlot',
      i18nKey: 'groupSkipper.titles.productList',
    },
    {
      slot: 'Footer',
      i18nKey: 'groupSkipper.titles.footer',
    },
  ],
};
