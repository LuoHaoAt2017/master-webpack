import VueRouter from 'vue-router';
import Vue from 'vue';
import {
  H3Toast,
  H3Modal,
} from '@h3/thinking-ui';
import { H3ImageViewerPlugin } from '@h3/thinking-ui/types/image-viewer';
import { H3ToastPlugin } from '@h3/thinking-ui/types/toast';
import { H3ModalPlugin } from '@h3/thinking-ui/types/modal';
// import {Dictionary, ErrorHandler} from "vue-router/types/router";

interface BackStack{
  getStackSize(): number;
  pop(): void;
  push(cb: Function): void;
  popOnly(): void;
}

declare module 'vue/types/vue' {
  interface Vue {
    backStack: BackStack;
    /**
   * @deprecated 准备弃用
   */
    $aut: any;
    $h3: any;
    $imageviewer: typeof H3ImageViewerPlugin;
    eventHub: Vue;
    $sentry: any;
    $toast: typeof H3ToastPlugin;
    $modal: typeof H3ModalPlugin;
  }
}

declare module 'vue-router/types/router' {
  interface VueRouter {
    goBack (): void;
  }
}
