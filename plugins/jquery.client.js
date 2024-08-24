import $ from 'jquery';

export default defineNuxtPlugin(() => {
  window.$ = window.jQuery = $;
});
