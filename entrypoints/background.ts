import { browser } from '@wxt-dev/browser';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});
